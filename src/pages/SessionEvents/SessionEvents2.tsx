import React, {
  FC, useEffect, useMemo, useRef,
} from 'react';
import { useLocation } from 'react-router-dom';
import { GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import TableGrid from 'widgets/tableGrid/ui/TableGrid';
import { SessionEvent } from 'features/sessions/types/types';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { postSessionsData } from 'features/sessions/api';
import { useMutation, useQueryClient } from 'react-query';
import useTableGrid from '../../widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from '../../entities/dateRangeCalendar/model/dateRangeStore';

interface Row {
  dataTime: string
}

const SessionEvents2: FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const sessionId = params.get('id');
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
  } = useDataRequest<SessionEvent[]>(
    'session',
    () => postSessionsData({
      sessionId,
      paginationModel,
      sortModel,
      filterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
    }),
  );
  const { mutate } = useMutation<SessionEvent[]>(
    'session',
    () => postSessionsData({
      sessionId,
      paginationModel,
      sortModel,
      filterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
    }),
    {
      onSuccess: (data) => {
        queryClient.setQueryData('players', data);
      },
    },
  );

  useEffect(() => {
    if (!isFirstRender.current) {
      mutate();
    } else {
      isFirstRender.current = false;
    }
  }, [mutate, paginationModel, sortModel, filterModel, filterDate, dateRange]);

  const columns: GridColDef[] = useMemo(() => [
    { field: 'betId', headerName: 'Bet ID', flex: 1 },
    { field: 'actionType', headerName: 'Action Type', flex: 1 },
    {
      field: 'dataTime',
      headerName: 'Date Time',
      type: 'date',
      flex: 2,
      valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD HH:mm:ss'),
    },
    { field: 'amountBet', headerName: 'Amount Bet', flex: 1 },
    { field: 'amountWin', headerName: 'Amount Win', flex: 1 },
    { field: 'totalProfitUSD', headerName: 'Total Profit USD', flex: 1 },

  ], []);
  const rowId = (row: Row) => row.dataTime;
  return (
    <div>
      <TableGrid
        data={data}
        rowId={rowId}
        isLoading={isLoading}
        error={error as Error}
        columns={columns}
        title="Session Table"
      />
    </div>
  );
};

export default SessionEvents2;
