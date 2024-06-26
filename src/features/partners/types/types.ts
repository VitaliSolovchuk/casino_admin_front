import { GridFilterModel } from '@mui/x-data-grid';
import { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';
import { Dayjs } from 'dayjs';

export interface PartnersDataProps {
  filterModel: GridFilterModel,
  sortModel: GridSortModel
  paginationModel: GridPaginationModel,
  filterDate: {
    startDate: Dayjs | null,
    endDate: Dayjs | null,
  },
}

interface PartnerCurrencyStatistic {
  partnerId: number;
  partnerName: string;
  currencyName: string;
  totalPlayers: number;
  totalSessions: number;
  totalActions: number;
  totalAmountBet: string;
  totalAmountWin: string;
  totalProfit: string;
  totalProfitUSD: number;
  RTP: number;
}

export interface PartnerData {
  totalGGR: number;
  partnerCurrencyStatistic: PartnerCurrencyStatistic[];
}
