import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'playerId', headerName: 'Player ID', flex: 1 },
  { field: 'sessionId', headerName: 'Session ID', flex: 1 },
  { field: 'currencyName', headerName: 'Currency', flex: 1 },
  { field: 'gameName', headerName: 'Game Name', flex: 1 },
  { field: 'actions', headerName: 'Actions', flex: 1 },
  { field: 'betAmount', headerName: 'Total Bet', flex: 1 },
  { field: 'winAmount', headerName: 'Total Win', flex: 1 },
  { field: 'totalProfit', headerName: 'Total Profit', flex: 1 },
  { field: 'totalProfitUSD', headerName: 'Total Profit USD', flex: 1 },
];
