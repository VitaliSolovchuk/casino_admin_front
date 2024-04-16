import { GridFilterModel } from '@mui/x-data-grid';
import { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';
import { Dayjs } from 'dayjs';
import { DateRange } from '@mui/x-date-pickers-pro';

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

export interface getPlayersProps {
  partnerId: string | null,
  params: {
    filterModel: GridFilterModel,
    sortModel: GridSortModel
    paginationModel: GridPaginationModel,
    filterDate: {
      dateRange: DateRange<Dayjs>
    },
  }
}

export interface postPlayersProps {
  partnerId: string | null,
  currency: string | null,
  filterModel: GridFilterModel,
  sortModel: GridSortModel
  paginationModel: GridPaginationModel,
  filterDate: {
    startDate: Dayjs | null,
    endDate: Dayjs | null,
  },
}
