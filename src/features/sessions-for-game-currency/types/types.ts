import { GridFilterModel } from '@mui/x-data-grid';
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';
import { Dayjs } from 'dayjs';

export interface SessionsPartnerGameCurrencyDataProps {
  partnerId: string;
  currencyName: string;
  gameName: string;
  filterModel: GridFilterModel;
  paginationModel: GridPaginationModel;
  filterDate: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
}
export interface SessionForPlayer {
  userId: number;
  playerId: string;
  sessionId: string;
  currencyName: string;
  gameName: string;
  totalAmountBetUSD: number;
  totalAmountWinUSD: number;
  totalProfitUSD: number;
  startDate: Date;
  endDate: Date;
}
