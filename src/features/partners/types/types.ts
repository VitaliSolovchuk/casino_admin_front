import { GridFilterModel } from '@mui/x-data-grid';
// import { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';
import { Dayjs } from 'dayjs';

export interface PartnersDataProps {
  partnerId?: string | null;
  filterModel: GridFilterModel;
  // sortModel: GridSortModel;
  paginationModel: GridPaginationModel;
  filterDate: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
}

export interface GamesDataProps {
  filterModel: GridFilterModel;
  paginationModel: GridPaginationModel;
  filterDate: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
}

export interface PartnerCurrencyStatistic {
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

export interface GamesStatistic {
  gameId: number;
  gameName: string;
  totalPlayers: number;
  totalSessions: number;
  totalActions: number;
  totalAmountBet: string;
  totalAmountWin: string;
  totalProfit: string;
  totalProfitUSD: number;
  RTP: number;
}

export interface PartnerCurrency {
  partnerId: number;
  partnerName: string;
  totalPlayers: number;
  totalSessions: number;
  totalActions: number;
  totalAmountBetUsd: number;
  totalAmountWinUsd: number;
  ggrUsd: number;
  rtp: string;
}

export interface PartnerData {
  totalGgrUsd: number;
  currencyStatistics: PartnerCurrencyStatistic[];
}

export interface PartnerCurrensyData {
  totalGgrUsd: number;
  statistics: PartnerCurrency[];
}

export interface GamesData {
  totalGgrUsd: number;
  gameStatistics: GamesStatistic[];
}

export interface GamesWithUSDRTP {
  totalUniquePlayers: number;
  totalSessions: number;
  totalActions: number;
  currencyName: string;
  gameName: string;
  currencyId: number;
  RTP: string;
  totalGGRUSD: string;
  totalAmountBetUSD: string;
  totalAmountWinUSD: string;
}
