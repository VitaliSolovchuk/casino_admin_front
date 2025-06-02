import { GridColDef, GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import { postSessionsForPlayer2 } from 'features/search-player-user-sessions/api';
import { ItemSession2, SessionResponse2 } from 'features/search-player-user-sessions/types/types';
import {
  FC, useEffect, useMemo, useState, useContext, useRef,
} from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { paths } from 'shared/lib/consts/paths';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';
import { Button, Snackbar, Alert } from '@mui/material';
import { postUpdateServerKeyForUser } from 'features/dashboard/api';
import TotalGGRContext from '../../TotalGGRContext';
import useFilterDateRange from '../../entities/dateRangeCalendar/model/dateRangeStore';
import TableGrid from '../../shared/ui/TableGrid/TableGrid';

const SearchPlayer: FC = () => {
  const [playerIdInput, setPlayerIdInput] = useState<string>('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'totalProfitUSD', sort: 'desc' }]);
  const { setTotalGgrUsd } = useContext(TotalGGRContext);
  const hasMounted = useRef(false);
  const [localFilterModel, setLocalFilterModel] = useState<GridFilterModel>({ items: [], quickFilterValues: [] });
  const { paginationModel } = useTableGrid((state) => state);
  const { filterDate } = useFilterDateRange((state) => state);
  const { dateRange } = filterDate;

  const {
    data,
    isLoading,
    error,
  } = useDataRequest<SessionResponse2>(
    'player-sessions-',
    () => postSessionsForPlayer2({
      paginationModel,
      filterModel: localFilterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
      playerId: playerIdInput,
      sortModel,
    }),
  );

  const { mutate, isLoading: isLoadingMutate } = useMutationRequest<SessionResponse2>(
    'player-sessions-',
    () => postSessionsForPlayer2({
      paginationModel,
      filterModel: localFilterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
      playerId: playerIdInput,
      sortModel,
    }),
  );

  const { mutate: mutateUpdateServerKey, isLoading: isLoadingMutate2 } = useMutationRequest<string>(
    'player-sessions-',
    () => postUpdateServerKeyForUser({
      key: '4321q',
      playerId: playerIdInput,
    }),
  );

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleSortChange = (model: GridSortModel) => {
    setSortModel(model);
    mutate();
  };

  const handleReload = () => {
    mutateUpdateServerKey(undefined, {
      onSuccess: (data) => {
        setSnackbarMessage('Data reloaded successfully!');
        setSnackbarSeverity('success');
        setIsSnackbarOpen(true);
      },
      onError: (error: any) => {
        setSnackbarMessage(error?.message || 'Failed to reload data.');
        setSnackbarSeverity('error');
        setIsSnackbarOpen(true);
      },
    });
  };

  useEffect(() => {
    if (!isLoading && data) {
      setTotalGgrUsd(data?.filterGgrUsd);
    }

    if (error) {
      console.error('Error fetching data:', error);
    }
  }, [data, isLoading, error, setTotalGgrUsd]);

  useEffect(() => {
    if (hasMounted.current) {
      mutate();
    } else {
      hasMounted.current = true;
    }
  }, [mutate, paginationModel, localFilterModel, filterDate, dateRange]);

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

  const rowId = (row: ItemSession2): string => `${row.playerId}-${row.sessionId}`;

  const handleRowClick = (row: Record<string, number>) => {
    if (row.sessionId) {
      queryClient.invalidateQueries({ queryKey: 'session' })
        .then(() => navigate(`${paths.sessionEvents}/?id=${row.sessionId}`, {
          state: {
            filterModel: localFilterModel,
            paginationModel,
            filterDate: {
              startDate: dateRange[0],
              endDate: dateRange[1],
            },
          },
        }));
    }
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
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
        <Button
          variant="contained"
          color="primary"
          // onClick={handleReload}
          disabled={isLoading || isLoadingMutate}
        >
          reload Seed
        </Button>
      </div>

      <TableGrid
        data={data?.items || []}
        showDateRangeFilter
        rowCountState={data?.totalItemsCount || 0}
        rowId={rowId}
        isLoading={isLoading || isLoadingMutate}
        error={error as Error}
        columns={columns}
        handleRowClick={handleRowClick}
        title="SearchPlayer Table"
        sortModel={sortModel}
        onSortModelChange={handleSortChange}
        setLocalFilterModel={setLocalFilterModel}
      />
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SearchPlayer;
