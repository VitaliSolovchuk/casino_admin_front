import { GridFilterModel } from '@mui/x-data-grid';
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';
import { Dayjs } from 'dayjs';

export interface Player {
  playerId: string;
  sessionId: string;
  currencyName: string;
  gameName: string;
  totalActions: number;
  totalAmountBet: number;
  totalAmountWin: number;
  totalProfit: number;
}

export interface postPlayersProps {
  partnerId: string | null,
  currency: string | null,
  filterModel: GridFilterModel,
  // sortModel: GridSortModel
  paginationModel: GridPaginationModel,
  filterDate: {
    startDate: Dayjs | null,
    endDate: Dayjs | null,
  },
}
