import React, {
  FC, useEffect, useMemo, useRef,
} from 'react';
import { GridColDef } from '@mui/x-data-grid';
import TableGrid from 'widgets/tableGrid/ui/TableGrid';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';
import { postCurrencyGamesStatisticData } from 'features/currency-games/api';
import { CurrencyGamesData } from 'features/currency-games/types/types';
import CurrencyGamesTable from './CurrencyGamesTable';

// interface Row {
//   partnerId: number;
//   currencyName: string;
// }

const CurrencyGames: FC = () => {
  const {
    filterModel,
    sortModel,
    paginationModel,
  } = useTableGrid((state) => state);

  const {
    filterDate,
  } = useFilterDateRange((state) => state);

  const { dateRange } = filterDate;
  const isFirstRender = useRef(true);

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
    if (!isFirstRender.current) {
      mutate();
    } else {
      isFirstRender.current = false;
    }
  }, [mutate, paginationModel, sortModel, filterModel, filterDate, dateRange]);

  // const rowId = (row: Row) => `${row.partnerId}-${row.currencyName}`;
  return (
    <div>
      <CurrencyGamesTable
        data={data}
        // rowId={rowId}
        isLoading={isLoading || isLoadingMutate}
        error={error as Error}
      />
    </div>
  );
};
export default CurrencyGames;
