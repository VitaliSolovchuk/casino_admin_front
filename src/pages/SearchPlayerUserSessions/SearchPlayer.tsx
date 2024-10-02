import { GridColDef, GridSortModel } from '@mui/x-data-grid';
import { postSessionsForPlayer } from 'features/search-player-user-sessions/api';
import { ItemSession, SessionResponse } from 'features/search-player-user-sessions/types/types';
import {
  FC, useCallback, useEffect, useMemo, useState, useRef,
} from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { paths } from 'shared/lib/consts/paths';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';
import TableGridLocalSort from './TableGridLocalSort';

const SearchPlayer: FC = () => {
  const [playerIdInput, setPlayerIdInput] = useState<string>('');
  const [playerId, setPlayerId] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isFirstRender = useRef(true);
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'totalProfitUSD', sort: 'desc' }]);

  const {
    filterModel,
    paginationModel,
    setPaginationModel,
  } = useTableGrid((state) => state);

  const {
    data,
    isLoading,
    error,
  } = useDataRequest<SessionResponse>(
    'fetch-sessions-',
    () => postSessionsForPlayer({
      paginationModel,
      filterModel,
      filterDate: {
        startDate: null,
        endDate: null,
      },
      playerId: playerIdInput,
    }),
  );

  const sortedData = useMemo(() => {
    if (!data || data.items.length === 0) return [];
    if (!sortModel || sortModel.length === 0) return data.items;

    const { field, sort } = sortModel[0];

    const sorted = [...data.items].sort((a, b) => {
      let valueA = a[field as keyof ItemSession];
      let valueB = b[field as keyof ItemSession];

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

  const { mutate, isLoading: isLoadingMutate } = useMutationRequest<SessionResponse>(
    'fetch-sessions-',
    () => postSessionsForPlayer({
      paginationModel,
      filterModel,
      filterDate: {
        startDate: null,
        endDate: null,
      },
      playerId: playerIdInput,
    }),
  );

  useEffect(() => {
    if (!isLoading && data) {
      console.log('Data fetched:', data);
    }
    if (error) {
      console.error('Error fetching data:', error);
    }
  }, [data, isLoading, error]);

  const handleSubmit = useCallback(() => {
    setPlayerId(playerIdInput);
    if (playerIdInput) {
      mutate();
    }
  }, [playerIdInput, mutate]);

  useEffect(() => {
    if (!isFirstRender.current) {
      mutate();
    } else {
      isFirstRender.current = false;
    }
  }, [mutate, paginationModel, filterModel]);

  const columns: GridColDef[] = useMemo(() => [
    { field: 'playerId', headerName: 'Player ID', flex: 1 },
    { field: 'sessionId', headerName: 'Session ID', flex: 1 },
    { field: 'currencyName', headerName: 'Currency', flex: 1 },
    { field: 'gameName', headerName: 'Game Name', flex: 1 },
    { field: 'totalActions', headerName: 'Actions', flex: 1 },
    { field: 'totalAmountBetUSD', headerName: 'Total Bet', flex: 1 },
    { field: 'totalAmountWinUSD', headerName: 'Total Win', flex: 1 },
    { field: 'totalProfitUSD', headerName: 'Total Profit USD', flex: 1 },
    { field: 'startDate', headerName: 'Start Date', flex: 1 },
    { field: 'endDate', headerName: 'End Date', flex: 1 },
  ], []);

  const rowId = (row: ItemSession): string => `${row.playerId}-${row.sessionId}`;

  const handleRowClick = (row: Record<string, number>) => {
    if (row.sessionId) {
      queryClient.invalidateQueries({ queryKey: 'session' })
        .then(() => navigate(`${paths.sessionEvents}/?id=${row.sessionId}`, {
          state: {
            filterModel,
            paginationModel,
            filterDate: {
              startDate: null,
              endDate: null,
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
        rowCountState={data?.totalItemsCount}
        rowId={rowId}
        isLoading={isLoading || isLoadingMutate}
        error={error as Error}
        columns={columns}
        handleRowClick={handleRowClick}
        title="SearchPlayer Table"
        sortModel={sortModel}
        onSortModelChange={handleSortChange}
        showDateRangeFilter={false}
      />
    </div>
  );
};

export default SearchPlayer;
