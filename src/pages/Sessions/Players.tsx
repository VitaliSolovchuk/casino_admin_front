import React, {
  FC, useEffect, useMemo,
  useState,
} from 'react';
import {
  useLocation, useNavigate,
} from 'react-router-dom';
import { GridColDef, GridSortModel } from '@mui/x-data-grid';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { Player } from 'features/players/types/types';
import { postPlayersData } from 'features/players/api';
import { useQueryClient } from 'react-query';
import { paths } from 'shared/lib/consts/paths';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';
import TableGridLocalSort from 'widgets/tableGrid/ui/TableGridLocalSort';

interface Row {
  partnerId: string;
  playerId: string;
  sessionId: string;
}

const Players: FC = () => {
  const { search, state } = useLocation();
  const params = new URLSearchParams(search);
  const partnerId = params.get('id');
  const currency = params.get('currency');

  const navigate = useNavigate();
  const {
    filterModel,
    // sortModel,
    paginationModel,
  } = useTableGrid((state) => state);
  const { filterDate } = useFilterDateRange((state) => state);
  const { dateRange } = filterDate;
  const queryClient = useQueryClient();
  // const isFirstRender = useRef(true);

  const {
    data,
    isLoading,
    error,
  } = useDataRequest<Player[]>(
    'players',
    () => postPlayersData({
      partnerId,
      currency,
      paginationModel,
      // sortModel,
      filterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
    }),
  );

  const { mutate } = useMutationRequest<Player[]>(
    'players',
    () => postPlayersData({
      partnerId,
      currency,
      paginationModel,
      // sortModel,
      filterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
    }),
  );

  useEffect(() => {
    mutate();
  }, [mutate, paginationModel, filterModel, filterDate, dateRange]);

  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'ggrUsd', sort: 'desc' }]);

  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (!sortModel || sortModel.length === 0) return data;

    const { field, sort } = sortModel[0];

    const sorted = [...data].sort((a, b) => {
      let valueA = a[field as keyof Player];
      let valueB = b[field as keyof Player];

      // eslint-disable-next-line max-len
      const isNumeric = (val: any) => typeof val === 'number' || (typeof val === 'string' && !Number.isNaN(parseFloat(val)) && Number.isFinite(val));

      if (isNumeric(valueA)) {
        valueA = parseFloat(valueA.toString());
        valueB = parseFloat(valueB.toString());
      } else {
        valueA = valueA?.toString().toLowerCase() ?? '';
        valueB = valueB?.toString().toLowerCase() ?? '';
      }

      if (valueA < valueB) return sort === 'asc' ? -1 : 1;
      if (valueA > valueB) return sort === 'asc' ? 1 : -1;

      return 0;
    });
    return sorted;
  }, [data, sortModel]);

  const handleSortChange = (model: GridSortModel) => {
    setSortModel(model);
  };

  const columns: GridColDef[] = useMemo(() => [
    { field: 'playerId', headerName: 'Player ID', flex: 1 },
    { field: 'sessionId', headerName: 'Session ID', flex: 1 },
    { field: 'currencyName', headerName: 'Currency', flex: 1 },
    { field: 'gameName', headerName: 'Game Name', flex: 1 },
    { field: 'totalActions', headerName: 'Actions', flex: 1 },
    { field: 'totalAmountBetUSD', headerName: 'Total Bet', flex: 1 },
    { field: 'totalAmountWinUSD', headerName: 'Total Win', flex: 1 },
    { field: 'totalGGRUSD', headerName: 'Total Profit USD', flex: 1 },
  ], []);

  const rowId = (row: Row) => `${row.partnerId}-${row.playerId}-${row.sessionId}`;
  const handleRowClick = (row: Record<string, number>) => {
    if (row.sessionId) {
      queryClient.invalidateQueries({ queryKey: 'session' })
        .then(() => navigate(`${paths.sessionEvents}/?id=${row.sessionId}`, { state: { ...state, Players: search } }));
    }
  };
  return (
    <div>
      <TableGridLocalSort
        data={sortedData}
        rowId={rowId}
        isLoading={isLoading}
        error={error as Error}
        columns={columns}
        handleRowClick={handleRowClick}
        title="Players Table"
        sortModel={sortModel}
        onSortModelChange={handleSortChange}
      />
    </div>
  );
};

export default Players;
