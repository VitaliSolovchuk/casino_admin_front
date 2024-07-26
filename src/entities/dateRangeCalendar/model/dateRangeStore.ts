import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import dayjs, { Dayjs } from 'dayjs';
import { storeShallowHOC } from 'shared/lib/utils/storeWithShallow';
import { DateRange } from '@mui/x-date-pickers-pro';

interface IFilterDateRange {
  filterDate: {
    dateRange: DateRange<Dayjs>;
  };
  setFilterDate: (model: DateRange<Dayjs>) => void;
}
// Начало текущего дня
const startOfToday = dayjs().utc().startOf('day');
// Конец текущего дня
const endOfToday = dayjs().utc().endOf('day');

const useFilterDateRange = storeShallowHOC(
  create(
    devtools(
      persist(
        immer<IFilterDateRange>((set) => ({
          filterDate: {
            dateRange: [startOfToday, endOfToday],
          },

          setFilterDate: (filterDate) => set((state) => {
            state.filterDate.dateRange = filterDate;
          }),
        })),
        { name: 'date-range' },
      ),
    ),
  ),
);
export default useFilterDateRange;
