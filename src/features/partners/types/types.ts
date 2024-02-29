import { GridFilterModel } from '@mui/x-data-grid';
import { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';
import { Dayjs } from 'dayjs';

export interface PartnerData {
  partnerId: number;
  partnerName: string;
  currencyName: string;
  uniquePlayers: Record<string, any>;
  totalPlayers: number;
  sessionCount: number;
  totalActions: number;
  totalAmountBet: number;
  totalAmountWin: number;
  totalProfit: number;
}
export interface PartnersDataProps {
  filterModel: GridFilterModel,
  sortModel: GridSortModel
  paginationModel: GridPaginationModel,
  filterDate: {
    startDate: Dayjs | null,
    endDate: Dayjs | null,
  },
}
