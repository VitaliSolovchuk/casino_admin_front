import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { storeShallowHOC } from 'shared/lib/utils/storeWithShallow';

interface IFilterDateRange {
  ggr: number | null
  setGgr: (ggr: number | null) => void
}
const useGgr = storeShallowHOC(
  create(devtools(persist(immer<IFilterDateRange>((set) => ({
    ggr: null,
    setGgr: (ggr) => set((state) => {
      state.ggr = ggr;
    }),
  })), { name: 'ggr' }))),
);
export default useGgr;
