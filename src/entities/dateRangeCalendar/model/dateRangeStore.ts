import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import dayjs, { Dayjs } from 'dayjs';
import { storeShallowHOC } from 'shared/lib/utils/storeWithShallow';
import { DateRange } from '@mui/x-date-pickers-pro';

interface IFilterDateRange {
  filterDate: {
    dateRange: DateRange<Dayjs>
  },
  setFilterDate: (model: DateRange<Dayjs>) => void
}

const useFilterDateRange = storeShallowHOC(
  create(devtools(persist(immer<IFilterDateRange>((set) => ({
    filterDate: {
      dateRange: [dayjs(), dayjs()],
    },

    setFilterDate: (filterDate) => set((state) => {
      state.filterDate.dateRange = filterDate;
    }),
  })), { name: 'date-range' }))),
);
export default useFilterDateRange;
