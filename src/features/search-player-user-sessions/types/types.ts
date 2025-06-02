import { GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';
import { Dayjs } from 'dayjs';

export interface ItemSession2 {
  userId: number;
  playerId: string;
  sessionId: string;
  currencyName: string;
  gameName: string;
  totalAmountBetUsd: number;
  totalAmountWinUsd: number;
  totalProfitUsd: number;
  startDate: Date;
  endDate: Date;
  ipAddress: string;
  actions: string;
}

export interface SessionResponse2 {
  items: ItemSession2[];
  page: number;
  pageSize: number;
  pagesCount: number;
  totalItemsCount: number;
  filterGgrUsd?: number;
}

export interface postPlayerUserSessionsProps extends SessionsForUserDto {
  filterDate: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
  filterModel: GridFilterModel;
  sortModel: GridSortModel;
  paginationModel: GridPaginationModel;
}

export interface SessionsForUserDto {
  playerId: string;
}

export interface SessionForUserForBetDto {
  betId: number;
}
