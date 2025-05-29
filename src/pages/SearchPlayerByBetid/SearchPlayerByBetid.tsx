import { GridColDef, GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import { postSessionForPlayer } from 'features/search-player-user-sessions/api';
import { ItemSession2 } from 'features/search-player-user-sessions/types/types';
import {
  FC, useEffect, useMemo, useState, useRef,
} from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { paths } from 'shared/lib/consts/paths';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';
import { Snackbar, Alert } from '@mui/material';
import useFilterDateRange from '../../entities/dateRangeCalendar/model/dateRangeStore';
import TableGrid from '../../shared/ui/TableGrid/TableGrid';

const SearchPlayerByBetid: FC = () => {
  const [betIdInput, setBetIdInput] = useState<string>('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasMounted = useRef(false);
  const [localFilterModel, setLocalFilterModel] = useState<GridFilterModel>({ items: [], quickFilterValues: [] });
  const { paginationModel } = useTableGrid((state) => state);
  const { filterDate } = useFilterDateRange((state) => state);
  const { dateRange } = filterDate;

  const {
    data,
    isLoading,
    error,
  } = useDataRequest<ItemSession2>(
    'player-sessions-',
    () => postSessionForPlayer({
      betId: +betIdInput,
    }),
    {
      enabled: false,
    },
  );

  const { mutate, isLoading: isLoadingMutate } = useMutationRequest<ItemSession2>(
    'player-sessions-',
    () => postSessionForPlayer({
      betId: +betIdInput,
    }),
  );

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleSortChange = (model: GridSortModel) => {
    mutate();
  };

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
          Bet ID:
          <input
            id="playerIdInput"
            type="text"
            value={betIdInput}
            onChange={(e) => setBetIdInput(e.target.value)}
          />
        </label>
      </div>

      <TableGrid
        data={data ? [data] : []}
        showDateRangeFilter
        rowCountState={data ? 1 : 0}
        rowId={rowId}
        isLoading={isLoading || isLoadingMutate}
        error={error as Error}
        columns={columns}
        handleRowClick={handleRowClick}
        title="SearchPlayer Table"
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

export default SearchPlayerByBetid;
