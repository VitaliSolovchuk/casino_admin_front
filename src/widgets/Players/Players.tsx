import React, { useState, useEffect, FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';

interface Player {
  playerId: string;
  sessionId: string;
  partnerId: string;
  currencyName: string;
  gameName: string;
  totalActions: number;
  totalAmountBet: number;
  totalAmountWin: number;
  totalProfit: number;
}

const columns: GridColDef[] = [
  { field: 'playerId', headerName: 'Player ID', flex: 1 },
  {
    field: 'sessionId',
    headerName: 'Session ID',
    flex: 1,
    renderCell: (params) => (
      <Link to={`/partners/${params.row.partnerId}/players/${params.row.playerId}/sessions/${params.row.sessionId}`}>
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

const Players: FC = () => {
  const { partnerId } = useParams<{ partnerId: string }>();
  const [playersData, setPlayersData] = useState<Player[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Player[]>(
          `https://dev.jetgames.io/admin-panel/players-for-partner?partnerId=${partnerId}`,
        );
        setPlayersData(response.data);
      } catch (error) {
        console.error('Error fetching partner players data:', error);
      }
    };

    fetchData();
  }, [partnerId]);

  return (
    <div>
      <DataGrid
        rows={playersData}
        columns={columns}
        // pageSize={25}
        // rowsPerPageOptions={[10, 25, 50, 100]}
        pagination
        autoHeight
        // disableSelectionOnClick
        getRowId={(row) => `${row.partnerId}-${row.playerId}-${row.sessionId}`} // Use a unique identifier
      />
    </div>
  );
};

export default Players;
