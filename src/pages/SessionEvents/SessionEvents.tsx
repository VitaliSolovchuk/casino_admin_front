import React, { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { format } from 'date-fns';
import { useQuery } from 'react-query';
import TableGrid from '../../widgets/tableGrid/ui/TableGrid';

interface SessionEvent {
  actionType: string;
  dataTime: string;
  amountBet: number;
  amountWin: number;
}
//
// type routeParams = {
//   sessionId: string;
// };
const SessionEvents: FC = () => {
  // const { sessionId } = useParams<routeParams>();
  const { search } = useLocation(); // search: "?id=2", state: "partner"
  const params = new URLSearchParams(search);
  const sessionId = params.get('id');

  const {
    data, isLoading, error, refetch,
  } = useQuery<SessionEvent[]>(
    'session',
    async () => {
      const response = await axios.get<SessionEvent[]>(
        `https://dev.jetgames.io/admin-panel/session-for-player?sessionId=${sessionId}`,
      );
      return response.data;
    },
    {
      cacheTime: 10 * 60 * 1000,
      staleTime: 10 * 60 * 1000,
    },
  );

  const columns: GridColDef[] = [
    { field: 'actionType', headerName: 'Action Type', flex: 1 },
    {
      field: 'dataTime',
      headerName: 'Date Time',
      type: 'date',
      flex: 2,
      valueFormatter: (params) => format(new Date(params.value), 'yyyy-MM-dd HH:mm:ss'),
    },
    { field: 'amountBet', headerName: 'Amount Bet', flex: 1 },
    { field: 'amountWin', headerName: 'Amount Win', flex: 1 },
  ];
  const rowId = (row: { dataTime: any }) => row.dataTime;
  // console.log(`${state}/Session Events`);
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
