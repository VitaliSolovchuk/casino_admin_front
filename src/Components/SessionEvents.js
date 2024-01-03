import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { DataGrid } from '@mui/x-data-grid';
import StyledTableContainer from '../Styles/StyledTableContainer'


import axios from 'axios';
import { format } from 'date-fns';

const SessionEvents = () => {
  const { sessionId } = useParams();
  const [sessionEvents, setSessionEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://dev.jetgames.io/admin-panel/session-for-player?sessionId=${sessionId}`);
        setSessionEvents(response.data);
      } catch (error) {
        console.error('Error fetching session events data:', error);
      }
    };

    fetchData();
  }, [sessionId]);

  const columns = [
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
  

  return (
    <StyledTableContainer>
      <DataGrid
        rows={sessionEvents}
        columns={columns}
        pageSize={25}
        rowsPerPageOptions={[10, 25, 50, 100]}
        pagination
        getRowId={(row) => row.dataTime}
        ></DataGrid>
    </StyledTableContainer>
  );
};

export default SessionEvents;