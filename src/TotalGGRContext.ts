import { createContext, Dispatch, SetStateAction } from 'react';

interface TotalGGRContextType {
  totalGgrUsd: number | undefined;
  setTotalGgrUsd: Dispatch<SetStateAction<number|undefined>>;
}

const TotalGGRContext = createContext<TotalGGRContextType>({
  totalGgrUsd: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTotalGgrUsd: () => {},
});

export default TotalGGRContext;
