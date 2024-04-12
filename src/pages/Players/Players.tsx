import React, {
  FC, useEffect, useMemo, useRef,
} from 'react';
import {
  useLocation, useNavigate,
} from 'react-router-dom';
import { GridColDef } from '@mui/x-data-grid';
import TableGrid from 'widgets/tableGrid/ui/TableGrid';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { Player } from 'features/players/types/types';
import { postPlayersData } from 'features/players/api';
import { useQueryClient } from 'react-query';
import { paths } from 'shared/lib/consts/paths';
import { useMutationRequest } from '../../shared/lib/hooks/useMutationRequest';

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
    sortModel,
    paginationModel,
  } = useTableGrid((state) => state);
  const { filterDate } = useFilterDateRange((state) => state);
  const { dateRange } = filterDate;
  const queryClient = useQueryClient();
  const isFirstRender = useRef(true);

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
      sortModel,
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
      sortModel,
      filterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
    }),
  );

  useEffect(() => {
    if (!isFirstRender.current) {
      mutate();
    } else {
      isFirstRender.current = false;
    }
  }, [mutate, paginationModel, sortModel, filterModel, filterDate, dateRange]);

  const columns: GridColDef[] = useMemo(() => [
    { field: 'playerId', headerName: 'Player ID', flex: 1 },
    { field: 'sessionId', headerName: 'Session ID', flex: 1 },
    { field: 'currencyName', headerName: 'Currency', flex: 1 },
    { field: 'gameName', headerName: 'Game Name', flex: 1 },
    { field: 'actions', headerName: 'Actions', flex: 1 },
    { field: 'betAmount', headerName: 'Total Bet', flex: 1 },
    { field: 'winAmount', headerName: 'Total Win', flex: 1 },
    { field: 'totalProfit', headerName: 'Total Profit', flex: 1 },
    { field: 'totalProfitUSD', headerName: 'Total Profit USD', flex: 1 },
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
      <TableGrid
        data={data}
        rowId={rowId}
        isLoading={isLoading}
        error={error as Error}
        columns={columns}
        handleRowClick={handleRowClick}
        title="Players Table"
      />
    </div>
  );
};

export default Players;
