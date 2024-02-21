import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import dayjs from 'dayjs';
import { storeShallowHOC } from 'shared/lib/utils/storeWithShallow';
import { GridFilterModel } from '@mui/x-data-grid';
import { GridCallbackDetails } from '@mui/x-data-grid/models/api';
import { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

interface ITableGrid {
  filterModel: GridFilterModel,
  sortModel: GridSortModel
  paginationModel: GridPaginationModel,
  setFilterModel: (model: GridFilterModel) => void;
  setSortModel: (model: GridSortModel, details: GridCallbackDetails) => void;
  setPaginationModel: (model: GridPaginationModel) => void
}

const useTableGrid = storeShallowHOC(
  create(devtools(persist(immer<ITableGrid>((set) => ({
    filterModel: {
      items: [],
      quickFilterValues: [],
    },
    paginationModel: {
      pageSize: 25,
      page: 0,
    },
    sortModel: [],

    setFilterModel: (filterModel) => set((state) => {
      state.filterModel = { ...state.filterModel, ...filterModel };
    }),
    setSortModel: (sortModel) => set((state) => {
      state.sortModel = sortModel;
    }),
    setPaginationModel: (paginationModel) => set((state) => {
      state.paginationModel = paginationModel;
    }),
  })), { name: 'table-grid' }))),
);
export default useTableGrid;
