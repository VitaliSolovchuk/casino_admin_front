import { GridColDef, GridSortModel } from '@mui/x-data-grid';
import { postSessionsForPlayer2 } from 'features/search-player-user-sessions/api';
import { ItemSession2, SessionResponse2 } from 'features/search-player-user-sessions/types/types';
import {
  FC, useEffect, useMemo, useState, useContext,
} from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { paths } from 'shared/lib/consts/paths';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';
import TableGridLocalSort from './TableGridLocalSort';
import TotalGGRContext from '../../TotalGGRContext';
import useFilterDateRange from '../../entities/dateRangeCalendar/model/dateRangeStore';

const SearchPlayer: FC = () => {
  const [playerIdInput, setPlayerIdInput] = useState<string>('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'totalProfitUSD', sort: 'desc' }]);
  const { setTotalGgrUsd } = useContext(TotalGGRContext);

  const {
    filterModel,
    paginationModel,
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
      sortModel,
    }),
  );

  // Мутация для отправки данных на сервер
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
      sortModel,
    }),
  );

  const handleSortChange = (model: GridSortModel) => {
    setSortModel(model);
    mutate();
  };

  // Хук для обновления данных по общему доходу
  useEffect(() => {
    if (!isLoading && data) {
      setTotalGgrUsd(data?.filterGgrUsd);
    }

    if (error) {
      console.error('Error fetching data:', error);
    }
  }, [data, isLoading, error, setTotalGgrUsd]);

  useEffect(() => {
    mutate();
  }, [mutate, paginationModel, filterModel, filterDate, dateRange]);

  const columns: GridColDef[] = useMemo(() => [
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

  // Уникальный идентификатор строки
  const rowId = (row: ItemSession2): string => `${row.playerId}-${row.sessionId}`;

  // Обработчик клика по строке
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
      </div>
      <TableGridLocalSort
        data={data?.items || []}
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

export default SearchPlayer;
