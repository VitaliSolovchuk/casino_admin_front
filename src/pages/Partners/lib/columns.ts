import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  {
    field: 'partnerName',
    headerName: 'Partner',
    flex: 1,
  },
  {
    field: 'currencyName',
    headerName: 'Currency',
    flex: 1,
  },
  {
    field: 'totalPlayers',
    headerName: 'Players',
    flex: 1,
  },
  {
    field: 'totalSessions',
    headerName: 'Sessions',
    flex: 1,
  },
  {
    field: 'totalActions',
    headerName: 'Actions',
    flex: 1,
  },
  {
    field: 'totalAmountBet',
    headerName: 'Total Bet',
    flex: 1,
  },
  {
    field: 'totalAmountWin',
    headerName: 'Total Win',
    flex: 1,
  },
  {
    field: 'totalProfit',
    headerName: 'Total Profit',
    flex: 1,
  },
  {
    field: 'totalProfitUSD',
    headerName: 'Total Profit USD',
    flex: 1,
  },
  {
    field: 'RTP',
    headerName: 'RTP %',
    flex: 1,
  },
];
