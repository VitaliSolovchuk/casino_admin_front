import React, { useState, useEffect, FC } from 'react';
import { useParams } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { format } from 'date-fns';

interface SessionEvent {
  actionType: string;
  dataTime: string;
  amountBet: number;
  amountWin: number;
}

interface RouteParams {
  sessionId?: string;
}

const SessionEvents: FC = () => {
  const { sessionId }: RouteParams = useParams();
  const [sessionEvents, setSessionEvents] = useState<SessionEvent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ data: SessionEvent[] }>(
          `https://dev.jetgames.io/admin-panel/session-for-player?sessionId=${sessionId}`,
        );
        setSessionEvents(response.data.data);
      } catch (error) {
        console.error('Error fetching session events data:', error);
      }
    };

    if (sessionId) {
      fetchData();
    }
  }, [sessionId]);

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

  return (
    <div>
      <DataGrid
        rows={sessionEvents}
        columns={columns}
        // pageSize={25}
        // rowsPerPageOptions={[10, 25, 50, 100]}
        pagination
        getRowId={(row) => row.dataTime}
      />
    </div>
  );
};

export default SessionEvents;
