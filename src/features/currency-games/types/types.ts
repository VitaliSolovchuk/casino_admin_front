import { GridFilterModel } from '@mui/x-data-grid';
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';
import { Dayjs } from 'dayjs';

export interface CurrencyGamesDataProps {
  filterModel: GridFilterModel;
  paginationModel: GridPaginationModel;
  filterDate: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
}
export interface Games {
  gameId: number;
  gameName: string;
  currencyGameGgr: string;
  usdGameGgr: string;
}

export interface GamesStatistic {
  currencyId: number;
  currencyName: string;
  games: Games[]
  currencyGgr: string;
  usdGgr: string;
}

export interface CurrencyGamesData {
  totalGgrUsd: number;
  gameStatistics: GamesStatistic[];
}
