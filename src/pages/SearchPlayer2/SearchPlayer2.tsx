import { GridColDef, GridSortModel } from '@mui/x-data-grid';
import { postSessionsForPlayer2 } from 'features/search-player-user-sessions/api';
import { ItemSession2, SessionResponse2 } from 'features/search-player-user-sessions/types/types';
import {
  FC, useCallback, useEffect, useMemo, useState, useContext,
} from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { paths } from 'shared/lib/consts/paths';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';
import TableGridLocalSort from '../SearchPlayerUserSessions/TableGridLocalSort';
import TotalGGRContext from '../../TotalGGRContext';
import useFilterDateRange from '../../entities/dateRangeCalendar/model/dateRangeStore';

const SearchPlayer2: FC = () => {
  const [playerIdInput, setPlayerIdInput] = useState<string>('');
  const [, setPlayerId] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'totalProfitUSD', sort: 'desc' }]);
  const { setTotalGgrUsd } = useContext(TotalGGRContext);

  const {
    filterModel,
    paginationModel,
    setPaginationModel,
  } = useTableGrid((state) => state);

  const {
    filterDate,
  } = useFilterDateRange((state) => state);

  const { dateRange } = filterDate;

  const {
    data,
    isLoading,
    error,
  } = useDataRequest<SessionResponse2>(
    'player-sessions-',
    () => postSessionsForPlayer2({
      paginationModel,
      filterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
      playerId: playerIdInput,
    }),
  );

  const sortedData = useMemo(() => {
    if (!data || data.items.length === 0) return [];
    if (!sortModel || sortModel.length === 0) return data.items;

    const { field, sort } = sortModel[0];

    const sorted = [...data.items].sort((a, b) => {
      let valueA = a[field as keyof ItemSession2];
      let valueB = b[field as keyof ItemSession2];

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

  const { mutate, isLoading: isLoadingMutate } = useMutationRequest<SessionResponse2>(
    'player-sessions-',
    () => postSessionsForPlayer2({
      paginationModel,
      filterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
      playerId: playerIdInput,
    }),
  );

  useEffect(() => {
    if (!isLoading && data) {
      setTotalGgrUsd(data?.filterGgrUsd);
    }

    if (error) {
      console.error('Error fetching data:', error);
    }
  }, [data, isLoading, error, setTotalGgrUsd]);

  const handleSubmit = useCallback(() => {
    setPlayerId(playerIdInput);
    if (playerIdInput) {
      mutate();
    }
  }, [playerIdInput, mutate]);

  useEffect(() => {
    mutate();
  }, [mutate, paginationModel, filterModel, filterDate, dateRange]);

  const columns: GridColDef[] = useMemo(() => [
    // { field: 'playerId', headerName: 'Player ID', flex: 1 },
    { field: 'sessionId', headerName: 'Session ID', flex: 1 },
    { field: 'currencyName', headerName: 'Currency', flex: 1 },
    { field: 'gameName', headerName: 'Game Name', flex: 1 },
    { field: 'actions', headerName: 'Actions', flex: 1 },
    { field: 'totalAmountBetUsd', headerName: 'Total Bet', flex: 1 },
    { field: 'totalAmountWinUsd', headerName: 'Total Win', flex: 1 },
    { field: 'totalProfitUsd', headerName: 'Total Profit USD', flex: 1 },
    { field: 'startDate', headerName: 'Start Date', flex: 1 },
    { field: 'endDate', headerName: 'End Date', flex: 1 },
    { field: 'ipAddress', headerName: 'IP Address', flex: 1 },
  ], []);

  const rowId = (row: ItemSession2): string => `${row.playerId}-${row.sessionId}`;

  const handleRowClick = (row: Record<string, number>) => {
    if (row.sessionId) {
      queryClient.invalidateQueries({ queryKey: 'session' })
        .then(() => navigate(`${paths.sessionEvents}/?id=${row.sessionId}`, {
          state: {
            filterModel,
            paginationModel,
            filterDate: {
              startDate: dateRange[0],
              endDate: dateRange[1],
            },
          },
        }));
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="playerIdInput">
          Player ID:
          <input
            id="playerIdInput"
            type="text"
            value={playerIdInput}
            onChange={(e) => setPlayerIdInput(e.target.value)}
          />
        </label>
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <TableGridLocalSort
        data={sortedData}
        showDateRangeFilter
        rowCountState={data?.totalItemsCount}
        rowId={rowId}
        isLoading={isLoading || isLoadingMutate}
        error={error as Error}
        columns={columns}
        handleRowClick={handleRowClick}
        title="SearchPlayer Table"
        sortModel={sortModel}
        onSortModelChange={handleSortChange}
      />
    </div>
  );
};

export default SearchPlayer2;
