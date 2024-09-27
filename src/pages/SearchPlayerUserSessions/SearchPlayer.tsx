import { GridColDef, GridSortModel } from '@mui/x-data-grid';
import { postSessionsForPlayer } from 'features/search-player-user-sessions/api';
import { ItemSession, SessionResponse, SessionsForUserDto } from 'features/search-player-user-sessions/types/types';
import {
  FC, useCallback, useMemo, useState,
} from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { paths } from 'shared/lib/consts/paths';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import TableGridLocalSort from './TableGridLocalSort';

const SearchPlayer: FC = () => {
  const [playerIdInput, setPlayerIdInput] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ItemSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { filterModel, paginationModel } = useTableGrid((state) => state);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'totalProfitUSD', sort: 'desc' }]);

  const fetchSessions = async (dto: SessionsForUserDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await postSessionsForPlayer({
        filterModel,
        paginationModel,
        filterDate: {
          startDate: null,
          endDate: null,
        },
        playerId: dto.playerId,
      });
      setSessions(data.items);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = useCallback(() => {
    setPlayerId(playerIdInput);

    if (playerIdInput) {
      fetchSessions({ playerId: playerIdInput });
    }
  }, [playerIdInput, filterModel, paginationModel]);

  const sortedData = useMemo(() => {
    if (!sessions || !sortModel || sortModel.length === 0) return [];

    const { field, sort } = sortModel[0];

    const sorted = [...sessions].sort((a, b) => {
      let valueA = a[field as keyof ItemSession];
      let valueB = b[field as keyof ItemSession];

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
  }, [sessions, sortModel]);

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
            value={playerIdInput || ''}
            onChange={(e) => {
              setPlayerIdInput(e.target.value);
            }}
          />
        </label>
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <TableGridLocalSort
        data={sortedData}
        rowId={rowId}
        isLoading={isLoading}
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
