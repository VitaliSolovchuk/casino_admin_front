import React, {
  FC, useEffect, useRef, useContext,
} from 'react';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';
import { postCurrencyGamesStatisticData } from 'features/currency-games/api';
import { CurrencyGamesData } from 'features/currency-games/types/types';
import CurrencyGamesTable from './CurrencyGamesTable';
import TotalGGRContext from '../../TotalGGRContext';

const CurrencyGames: FC = () => {
  const {
    filterModel,
    paginationModel,
  } = useTableGrid((state) => state);

  const {
    filterDate,
  } = useFilterDateRange((state) => state);

  const { dateRange } = filterDate;
  const isFirstRender = useRef(true);
  const { setTotalGgrUsd } = useContext(TotalGGRContext);

  const {
    data,
    isLoading,
    error,
  } = useDataRequest<CurrencyGamesData>(
    'currency-games-',
    () => postCurrencyGamesStatisticData({
      paginationModel,
      filterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
    }),
  );

  const { mutate, isLoading: isLoadingMutate } = useMutationRequest<CurrencyGamesData>(
    'currency-games-',
    () => postCurrencyGamesStatisticData(
      {
        paginationModel,
        filterModel,
        filterDate: {
          startDate: dateRange[0],
          endDate: dateRange[1],
        },
      },
    ),
  );

  useEffect(() => {
    if (!isLoading && data) {
      setTotalGgrUsd(data.totalGgrUsd);
    }

    if (error) {
      console.error('Error fetching data:', error);
    }
  }, [data, isLoading, error, setTotalGgrUsd]);

  useEffect(() => {
    if (!isFirstRender.current) {
      mutate();
    } else {
      isFirstRender.current = false;
    }
  }, [mutate, paginationModel, filterModel, filterDate, dateRange]);

  return (
    <div>
      <CurrencyGamesTable
        data={data}
        isLoading={isLoading || isLoadingMutate}
        error={error as Error}
      />
    </div>
  );
};
export default CurrencyGames;
