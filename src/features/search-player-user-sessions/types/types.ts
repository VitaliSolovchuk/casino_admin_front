import { GridFilterModel } from '@mui/x-data-grid';
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
  filterModel: GridFilterModel;
  paginationModel: GridPaginationModel;
  filterDate: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
}

export interface SessionsForUserDto {
  playerId: string;
}
