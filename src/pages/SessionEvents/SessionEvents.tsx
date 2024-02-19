import React, { useState, FC } from 'react';
import { useParams } from 'react-router-dom';
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

type routeParams = {
  sessionId: string;
};
type pagination = {
  pageSize: number;
  page: number;
};

const SessionEvents: FC = () => {
  const { sessionId } = useParams<routeParams>();
  const [paginationModel, setPaginationModel] = useState<pagination>({
    pageSize: 25,
    page: 0,
  });
  const [filterModel, setFilterModel] = useState<Record<string, any>>({
    items: [],
  });
  const [sortModel, setSortModel] = useState<Record<string, any>>([]);
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
      flex: 2,
      valueFormatter: (params) => format(new Date(params.value), 'yyyy-MM-dd HH:mm:ss'),
    },
    { field: 'amountBet', headerName: 'Amount Bet', flex: 1 },
    { field: 'amountWin', headerName: 'Amount Win', flex: 1 },
  ];
  const rowId = (row: { dataTime: any }) => row.dataTime;

  return (
    <div>
      <TableGrid
        data={data}
        rowId={rowId}
        isLoading={isLoading}
        error={error as Error}
        refetch={refetch}
        columns={columns}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        sortModel={sortModel}
        setSortModel={setSortModel}
        filterModel={filterModel}
        setFilterModel={setFilterModel}
        title="Session Table"
      />
    </div>
  );
};

export default SessionEvents;
