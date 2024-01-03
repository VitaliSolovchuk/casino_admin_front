import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import StyledLink from '../Styles/StyledLink';
import StyledTableContainer from '../Styles/StyledTableContainer';
import axios from 'axios';

const columns = [
  { field: 'playerId', headerName: 'Player ID', flex: 1 },
  {
    field: 'sessionId',
    headerName: 'Session ID',
    flex: 1,
    renderCell: (params) => (
      <StyledLink to={`/partners/${params.row.partnerId}/players/${params.row.playerId}/sessions/${params.row.sessionId}`}>
        {params.row.sessionId}
      </StyledLink>
    ),
  },
  { field: 'currencyName', headerName: 'Currency Name', flex: 1 },
  { field: 'gameName', headerName: 'Game Name', flex: 1 },
  { field: 'totalActions', headerName: 'Total Actions', flex: 1 },
  { field: 'totalAmountBet', headerName: 'Total Amount Bet', flex: 1 },
  { field: 'totalAmountWin', headerName: 'Total Amount Win', flex: 1 },
  { field: 'totalProfit', headerName: 'Total Profit', flex: 1 },
];

const Players = () => {
  const { partnerId } = useParams();
  const [playersData, setPlayersData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://dev.jetgames.io/admin-panel/players-for-partner?partnerId=${partnerId}`);
        setPlayersData(response.data);
      } catch (error) {
        console.error('Error fetching partner players data:', error);
      }
    };

    fetchData();
  }, [partnerId]);

  return (
    <StyledTableContainer>
      <DataGrid
        rows={playersData}
        columns={columns}
        pageSize={25}
        rowsPerPageOptions={[10, 25, 50, 100]}
        pagination
        autoHeight
        disableSelectionOnClick
        getRowId={(row) => `${row.partnerId}-${row.playerId}-${row.sessionId}`} // Use a unique identifier
      />
    </StyledTableContainer>
  );
};

export default Players;
