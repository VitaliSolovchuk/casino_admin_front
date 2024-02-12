import React, { useState, FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { useQuery } from 'react-query';
import Spinner from 'shared/ui/Spinner/Spinner';

interface Player {
  playerId: string;
  sessionId: string;
  currencyName: string;
  gameName: string;
  totalActions: number;
  totalAmountBet: number;
  totalAmountWin: number;
  totalProfit: number;
}
type routeParams = {
  partnerId: string
}
const Players: FC = () => {
  const { partnerId } = useParams<routeParams>();

  const { data, isLoading, error } = useQuery<Player[]>(
    'players',
    async () => {
      const response = await axios.get<Player[]>(
        `https://dev.jetgames.io/admin-panel/players-for-partner?partnerId=${partnerId}`,
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
    { field: 'playerId', headerName: 'Player ID', flex: 1 },
    {
      field: 'sessionId',
      headerName: 'Session ID',
      flex: 1,
      renderCell: (params) => (
        <Link to={`/partners/${partnerId}/players/${params.row.playerId}/sessions/${params.row.sessionId}`}>
          {params.row.sessionId}
        </Link>
      ),
    },
    { field: 'currencyName', headerName: 'Currency Name', flex: 1 },
    { field: 'gameName', headerName: 'Game Name', flex: 1 },
    { field: 'totalActions', headerName: 'Total Actions', flex: 1 },
    { field: 'totalAmountBet', headerName: 'Total Amount Bet', flex: 1 },
    { field: 'totalAmountWin', headerName: 'Total Amount Win', flex: 1 },
    { field: 'totalProfit', headerName: 'Total Profit', flex: 1 },
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
      <DataGrid
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={data || []}
        columns={columns}
        pagination
        autoHeight
        getRowId={(row) => `${row.partnerId}-${row.playerId}-${row.sessionId}`} // Use a unique identifier
      />
    </div>
  );
};

export default Players;
