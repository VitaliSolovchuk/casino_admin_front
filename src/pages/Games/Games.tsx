import React, {
  FC, useEffect, useMemo, useRef,
  useState,
} from 'react';
import { GridColDef, GridSortModel } from '@mui/x-data-grid';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { GamesWithUSDRTP } from 'features/partners/types/types';
import { postGamesData } from 'features/partners/api';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';
import TableGridLocalSort from 'widgets/tableGrid/ui/TableGridLocalSort';

interface Row {
  partnerId: number;
  currencyName: string;
  gameName: string;
}

const Games: FC = () => {
  const {
    filterModel,
    // sortModel,
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
  } = useDataRequest<GamesWithUSDRTP[]>(
    'games',
    () => postGamesData({
      paginationModel,
      filterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
    }),
  );

  const { mutate } = useMutationRequest<GamesWithUSDRTP[]>(
    'games',
    () => postGamesData(
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
  }, [mutate, paginationModel, filterModel, filterDate, dateRange]);

  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'gameName', sort: 'asc' }]);

  const sortedData = useMemo(() => {
    if (!data || !sortModel.length) return [];

    const { field, sort } = sortModel[0];
    return [...data].sort((a, b) => {
      const valueA = a[field as keyof GamesWithUSDRTP];
      const valueB = b[field as keyof GamesWithUSDRTP];

      // Преобразование значений в числа, если они являются строками, содержащими числа
      const numA = typeof valueA === 'string' ? parseFloat(valueA) : valueA;
      const numB = typeof valueB === 'string' ? parseFloat(valueB) : valueB;

      // Сравнение чисел и строк
      if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
        // Оба значения числовые
        return (numA - numB) * (sort === 'asc' ? 1 : -1);
      } if (typeof valueA === 'string' && typeof valueB === 'string') {
        // Оба значения строковые
        if (valueA < valueB) return sort === 'asc' ? -1 : 1;
        if (valueA > valueB) return sort === 'asc' ? 1 : -1;
      }

      // Если одно значение числовое, а другое строковое, сравниваем как строки
      if (typeof valueA === 'string') {
        return sort === 'asc' ? -1 : 1;
      }
      if (typeof valueB === 'string') {
        return sort === 'asc' ? 1 : -1;
      }

      // Если значения равны
      return 0;
    });
  }, [data, sortModel]);

  const handleSortChange = (model: GridSortModel) => {
    console.log('handleSortChange', model);
    setSortModel(model);
  };

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'gameName',
      headerName: 'Game',
      flex: 1,
      sortable: true,
    },
    {
      field: 'totalUniquePlayers',
      headerName: 'Players',
      flex: 1,
      sortable: true,
    },
    {
      field: 'totalSessions',
      headerName: 'Sessions',
      flex: 1,
      sortable: true,
    },
    {
      field: 'totalActions',
      headerName: 'Actions',
      flex: 1,
      sortable: true,
    },
    {
      field: 'totalAmountBetUSD',
      headerName: 'Total Bet',
      flex: 1,
      sortable: true,
    },
    {
      field: 'totalAmountWinUSD',
      headerName: 'Total Win',
      flex: 1,
      sortable: true,
    },
    {
      field: 'totalGGRUSD',
      headerName: 'Total Profit USD',
      flex: 1,
      sortable: true,
    },
    {
      field: 'RTP',
      headerName: 'RTP %',
      flex: 1,
      sortable: true,
    },
  ], []);

  const rowId = (row: Row) => `${row.gameName}`;
  return (
    <div>
      <TableGridLocalSort
        data={sortedData}
        rowId={rowId}
        isLoading={isLoading}
        error={error as Error}
        columns={columns}
        title="Games Table"
        sortModel={sortModel}
        onSortModelChange={handleSortChange}
      />
    </div>
  );
};
export default Games;
