import React, { useState, FC } from 'react';
import { useParams } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { format } from 'date-fns';
import { useQuery } from 'react-query';
import Spinner from '../../shared/ui/Spinner/Spinner';
import PageTitle from '../../entities/pageTitle/ui/PageTitle';

interface SessionEvent {
  actionType: string;
  dataTime: string;
  amountBet: number;
  amountWin: number;
}

type routeParams = {
  sessionId: string;
}

const SessionEvents: FC = () => {
  const { sessionId } = useParams<routeParams>();
  const { data, isLoading, error } = useQuery<SessionEvent[]>(
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

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });

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

  if (isLoading) return <Spinner />;
  if (error) {
    return (
      <div>
        Error fetching partners data:
        {(error as Error).message}
      </div>
    );
  }
  return (
    <div>
      <PageTitle title="Sessions Table" />
      <DataGrid
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={data || []}
        columns={columns}
        pagination
        getRowId={(row) => row.dataTime}
      />
    </div>
  );
};

export default SessionEvents;
