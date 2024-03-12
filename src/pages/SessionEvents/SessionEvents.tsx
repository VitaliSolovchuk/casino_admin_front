import React, { FC, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import TableGrid from 'widgets/tableGrid/ui/TableGrid';
import { SessionEvent } from '../../features/sessions/types/types';
import { useDataRequest } from '../../shared/lib/hooks/useDataRequest';
import { getSessionsData } from '../../features/sessions/api';

interface Row {
  dataTime: string
}

const SessionEvents: FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const sessionId = params.get('id');

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useDataRequest<SessionEvent[]>(
    'session',
    () => getSessionsData({ sessionId }),
  );

  const columns: GridColDef[] = useMemo(() => [
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
  ], []);
  const rowId = (row: Row) => row.dataTime;
  return (
    <div>
      <TableGrid
        data={data}
        rowId={rowId}
        isLoading={isLoading}
        error={error as Error}
        refetch={refetch}
        columns={columns}
        title="Session Table"
      />
    </div>
  );
};

export default SessionEvents;
