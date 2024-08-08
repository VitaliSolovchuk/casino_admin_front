import { GridColDef, GridSortModel } from '@mui/x-data-grid';
import { postSessionsForPlayer } from 'features/search-player-user-sessions/api';
import { Session, SessionsForUserDto } from 'features/search-player-user-sessions/types/types';
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
  const [userIdInput, setUserIdInput] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
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
        userId: dto.userId,
      });
      setSessions(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = useCallback(() => {
    setPlayerId(playerIdInput);
    setUserId(userIdInput);

    if (playerIdInput) {
      fetchSessions({ playerId: playerIdInput });
    } else if (userIdInput) {
      fetchSessions({ userId: +userIdInput });
    }
  }, [playerIdInput, userIdInput, filterModel, paginationModel]);

  const sortedData = useMemo(() => {
    if (!sessions || !sortModel || sortModel.length === 0) return [];

    const { field, sort } = sortModel[0];

    const sorted = [...sessions].sort((a, b) => {
      let valueA = a[field as keyof Session];
      let valueB = b[field as keyof Session];

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

  const rowId = (row: Session) => `${row.playerId}-${row.sessionId}`;

  const handleRowClick = ({ id }: { id: string }) => {
    // Split the combined key back into playerId and sessionId
    const [clickedPlayerId, clickedSessionId] = id.split('-');

    const session = sessions.find(
      (session) => session.playerId === clickedPlayerId && session.sessionId === clickedSessionId,
    );

    if (!session) {
      console.error(`Session with ID ${id} not found.`);
      return;
    }

    if (session.sessionId) {
      queryClient.invalidateQueries({ queryKey: 'session' })
        .then(() => navigate(`${paths.sessionEvents}/?id=${session.sessionId}`));
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
              setUserIdInput(null); // Очистка userId при вводе playerId
            }}
          />
        </label>
        <label htmlFor="userIdInput">
          User ID:
          <input
            id="userIdInput"
            type="text"
            value={userIdInput || ''}
            onChange={(e) => {
              setUserIdInput(e.target.value);
              setPlayerIdInput(null); // Очистка playerId при вводе userId
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
