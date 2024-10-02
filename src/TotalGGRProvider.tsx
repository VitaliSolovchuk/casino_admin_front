import React, { useState, ReactNode } from 'react';
import TotalGGRContext from './TotalGGRContext';

interface TotalGGRProviderProps {
  children: ReactNode;
}

const TotalGGRProvider: React.FC<TotalGGRProviderProps> = ({ children }) => {
  const [totalGgrUsd, setTotalGgrUsd] = useState<number>(0);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <TotalGGRContext.Provider value={{
      totalGgrUsd,
      setTotalGgrUsd,
    }}
    >
      {children}
    </TotalGGRContext.Provider>
  );
};

export default TotalGGRProvider;
