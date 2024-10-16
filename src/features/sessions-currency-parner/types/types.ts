import { GridFilterModel } from '@mui/x-data-grid';
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';
import { Dayjs } from 'dayjs';

export interface ResultSessionsInfo {
  items: SessionInfo[]
  page: number,
  filterGgrUsd: number,
  pageGgrUsd: number,
  pageSize: number,
  pagesCount: number,
  totalItemsCount: number
}
export interface SessionInfo {
  totalAmountBet: string,
  totalAmountWin: string,
  totalActions: number,
  partnerName: string,
  currencyName: string,
  gameName: string,
  partnerId: number,
  currencyId: number,
  playerId: number,
  sessionId: string,
  firstBetTime: Date,
  lastBetTime: Date,
  totalGgr: string,
  totalGgrUsd: number,
  Rtp: number,
  totalAmountBetUsd: number,
  totalAmountWinUsd: number
}

export interface postSessionsCurrency {
  partnerId: string,
  // TODO array
  currencyes: string
  filterModel: GridFilterModel,
  paginationModel: GridPaginationModel,
  filterDate: {
    startDate: Dayjs | null,
    endDate: Dayjs | null,
  },
}
