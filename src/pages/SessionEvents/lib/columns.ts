import { GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';

export const columns: GridColDef[] = [
  { field: 'betId', headerName: 'Bet ID', flex: 1 },
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
  { field: 'serverSeed', headerName: 'Server Seed', flex: 1 },

];
