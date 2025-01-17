import { GridFilterModel } from '@mui/x-data-grid';
import { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';
import { Dayjs } from 'dayjs';

export interface SessionEvent {
  actionType: string;
  dataTime: string;
  amountBet: number;
  amountWin: number;
  serverSeed: string;
  clientSeed: string;
}
export interface getSessionsProps {
  sessionId: string | null;
  filterModel: GridFilterModel;
  sortModel: GridSortModel;
  paginationModel: GridPaginationModel;
  filterDate: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
}
