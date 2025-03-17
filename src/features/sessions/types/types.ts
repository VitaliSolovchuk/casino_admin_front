import { GridFilterModel } from '@mui/x-data-grid';
import { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';
import { Dayjs } from 'dayjs';

export interface SessionEvent {
  betId: number;
  actionType: string;
  dataTime: string;
  // amountBet: number;
  // amountWin: number;
  totalAmountBetUSD: string;
  totalAmountWinUSD: string;

  serverSeed: string;
  clientSeed: string;
  nonce: number;

  BetCoefficientes: any;
  Refound: any | null;
  Round: any;
}
export interface getSessionsProps {
  sessionId: string | null;
  filterModel: GridFilterModel;
  sortModel: GridSortModel;
  paginationModel: GridPaginationModel;
  filterDate: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
}
