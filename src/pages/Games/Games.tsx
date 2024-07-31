import React, {
  FC, useEffect, useMemo, useRef,
  useState,
} from 'react';
import { GridColDef, GridSortModel } from '@mui/x-data-grid';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { GamesData, GamesStatistic } from 'features/partners/types/types';
import { postGamesStatisticData } from 'features/partners/api';
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
  } = useDataRequest<GamesData>(
    'games',
    () => postGamesStatisticData({
      paginationModel,
      filterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
    }),
  );

  const { mutate, isLoading: isLoadingMutate } = useMutationRequest<GamesData>(
    'games',
    () => postGamesStatisticData(
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
    if (!data || !sortModel || sortModel.length === 0) return [];

    const { field, sort } = sortModel[0];

    return [...data.gameStatistics].sort((a, b) => {
      let valueA = a[field as keyof GamesStatistic];
      let valueB = b[field as keyof GamesStatistic];

      // число в строке
      // eslint-disable-next-line max-len
      const isNumeric = (val: any) => typeof val === 'number' || (typeof val === 'string' && !Number.isNaN(parseFloat(val)) && Number.isFinite(val));

      if (isNumeric(valueA)) {
        valueA = parseFloat(valueA as string);
        valueB = parseFloat(valueB as string);
      } else {
        valueA = valueA?.toString().toLowerCase() ?? '';
        valueB = valueB?.toString().toLowerCase() ?? '';
      }

      if (valueA < valueB) return sort === 'asc' ? -1 : 1;
      if (valueA > valueB) return sort === 'asc' ? 1 : -1;

      return 0;
    });
  }, [data, sortModel]);
  const handleSortChange = (model: GridSortModel) => {
    // console.log('handleSortChange', model);
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
      field: 'totalPlayers',
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
      field: 'totalAmountBetUsd',
      headerName: 'Total Bet',
      flex: 1,
      sortable: true,
    },
    {
      field: 'totalAmountWinUsd',
      headerName: 'Total Win',
      flex: 1,
      sortable: true,
    },
    {
      field: 'ggrUsd',
      headerName: 'Total Profit USD',
      flex: 1,
      sortable: true,
    },
    {
      field: 'rtp',
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
        isLoading={isLoading || isLoadingMutate}
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
