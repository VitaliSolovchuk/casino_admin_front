import React, {
  FC, useEffect, useMemo, useRef,
  useState,
} from 'react';
import { GridColDef } from '@mui/x-data-grid';
import TableGrid from 'widgets/tableGrid/ui/TableGrid';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { GamesWithUSDRTP } from 'features/partners/types/types';
import { postGamesData } from 'features/partners/api';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';

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

  // eslint-disable-next-line max-len
  const [sortModel, setSortModel] = useState<{ field: string, sort: 'asc' | 'desc' }>({ field: 'gameName', sort: 'asc' });

  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      const { field, sort } = sortModel;
      const valueA = a[field as keyof GamesWithUSDRTP];
      const valueB = b[field as keyof GamesWithUSDRTP];

      if (valueA < valueB) return sort === 'asc' ? -1 : 1;
      if (valueA > valueB) return sort === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortModel]);

  const handleSortChange = (field: string) => {
    setSortModel((prevSortModel) => ({
      field,
      sort: prevSortModel.field === field && prevSortModel.sort === 'asc' ? 'desc' : 'asc',
    }));
  };

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'gameName',
      headerName: 'Game',
      flex: 1,
      sortable: true,
      onSortModelChange: () => handleSortChange('gameName'),
    },
    {
      field: 'totalUniquePlayers',
      headerName: 'Players',
      flex: 1,
      sortable: true,
      onSortModelChange: () => handleSortChange('totalUniquePlayers'),
    },
    {
      field: 'totalSessions',
      headerName: 'Sessions',
      flex: 1,
      sortable: true,
      onSortModelChange: () => handleSortChange('totalSessions'),
    },
    {
      field: 'totalActions',
      headerName: 'Actions',
      flex: 1,
      sortable: true,
      onSortModelChange: () => handleSortChange('totalActions'),
    },
    {
      field: 'totalAmountBetUSD',
      headerName: 'Total Bet',
      flex: 1,
      sortable: true,
      onSortModelChange: () => handleSortChange('totalAmountBetUSD'),
    },
    {
      field: 'totalAmountWinUSD',
      headerName: 'Total Win',
      flex: 1,
      sortable: true,
      onSortModelChange: () => handleSortChange('totalAmountWinUSD'),
    },
    {
      field: 'totalGGRUSD',
      headerName: 'Total Profit USD',
      flex: 1,
      sortable: true,
      onSortModelChange: () => handleSortChange('totalGGRUSD'),
    },
    {
      field: 'RTP',
      headerName: 'RTP %',
      flex: 1,
      sortable: true,
      onSortModelChange: () => handleSortChange('RTP'),
    },
  ], []);

  const rowId = (row: Row) => `${row.gameName}`;
  return (
    <div>
      <TableGrid
        data={sortedData}
        rowId={rowId}
        isLoading={isLoading}
        error={error as Error}
        columns={columns}
        title="Games Table"
      />
    </div>
  );
};
export default Games;
