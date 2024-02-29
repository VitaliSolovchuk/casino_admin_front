import React, { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import TableGrid from 'widgets/tableGrid/ui/TableGrid';
import { baseURL } from 'shared/lib/consts/url';
import { CACHE_TIME, STALE_TIME } from 'shared/lib/consts/time';

interface SessionEvent {
  actionType: string;
  dataTime: string;
  amountBet: number;
  amountWin: number;
}
interface Row {
  dataTime: string
}

const SessionEvents: FC = () => {
  const { search } = useLocation(); // search: "?id=2", state: "partner"
  const params = new URLSearchParams(search);
  const sessionId = params.get('id');

  const {
    data, isLoading, error, refetch,
  } = useQuery<SessionEvent[]>(
    'session',
    async () => {
      const response = await axios.get<SessionEvent[]>(
        `${baseURL}/admin-panel/session-for-player?sessionId=${sessionId}`,
      );
      return response.data;
    },
    {
      cacheTime: CACHE_TIME,
      staleTime: STALE_TIME,
    },
  );

  const columns: GridColDef[] = [
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
  ];
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
