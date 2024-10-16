import React, {
  FC, useEffect, useMemo, useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GridColDef, GridSortModel, GridFilterModel } from '@mui/x-data-grid';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { useQueryClient } from 'react-query';
import { paths } from 'shared/lib/consts/paths';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';
import { postSessionsCurrencyData } from 'features/sessions-currency-parner/api';
import { ResultSessionsInfo, SessionInfo } from 'features/sessions-currency-parner/types/types';
import TableGridLocalSort from './TableGridLocalSort';

interface Row {
  partnerId: string;
  playerId: string;
  sessionId: string;
}

const Sessions2: FC = () => {
  const { search, state } = useLocation();
  const params = new URLSearchParams(search);
  const partnerId = params.get('partner-id') || '5' as string;
  const currency = params.get('currency') as string;
  const gameName = params.get('game') as string | undefined;

  const navigate = useNavigate();
  const {
    filterModel, // Мы будем использовать это для хранения модели фильтра
    paginationModel,
  } = useTableGrid((state) => state);
  const { filterDate } = useFilterDateRange((state) => state);
  const { dateRange } = filterDate;
  const queryClient = useQueryClient();

  const initialFilterModel: GridFilterModel = {
    items: [
      ...(gameName
        ? [{ field: 'gameName', operator: 'contains', value: gameName }]
        : []),
      ...(currency
        ? [{ field: 'currencyName', operator: 'contains', value: currency }]
        : []),
    ],
    quickFilterValues: [],
  };

  const [localFilterModel, setLocalFilterModel] = useState<GridFilterModel>(initialFilterModel);

  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'ggrUsd', sort: 'desc' }]);

  const { data, isLoading, error } = useDataRequest<ResultSessionsInfo>(
    'sessions',
    () => postSessionsCurrencyData({
      partnerId,
      currencyes: currency,
      paginationModel,
      filterModel: localFilterModel, // Передаем обновленные фильтры
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
    }),
  );

  const { mutate, isLoading: isLoadingMutate } = useMutationRequest<ResultSessionsInfo>(
    'sessions',
    () => postSessionsCurrencyData({
      partnerId,
      currencyes: currency,
      paginationModel,
      filterModel: localFilterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
    }),
  );

  useEffect(() => {
    mutate();
  }, [mutate, paginationModel, filterModel, filterDate, dateRange]);

  const handleFilterModelChange = (newFilterModel: GridFilterModel) => {
    setLocalFilterModel(newFilterModel);
  };

  const handleSortChange = (model: GridSortModel) => {
    setSortModel(model);
  };

  const handleRowClick = (row: Record<string, number>) => {
    if (row.sessionId) {
      queryClient.invalidateQueries({ queryKey: 'session' })
        .then(() => navigate(`${paths.sessionEvents}/?id=${row.sessionId}`, { state: { ...state, Players: search } }));
    }
  };

  const columns: GridColDef[] = useMemo(() => [
    { field: 'playerId', headerName: 'Player ID', flex: 1 },
    { field: 'sessionId', headerName: 'Session ID', flex: 1 },
    { field: 'currencyName', headerName: 'Currency', flex: 1 },
    { field: 'gameName', headerName: 'Game', flex: 1 },
    { field: 'totalActions', headerName: 'Actions', flex: 1 },
    { field: 'totalAmountBetUsd', headerName: 'Total Bet (Usd)', flex: 1 },
    { field: 'totalAmountWinUsd', headerName: 'Total Win (Usd)', flex: 1 },
    { field: 'totalGgrUsd', headerName: 'Profit (Usd)', flex: 1 },
    { field: 'Rtp', headerName: 'Rtp', flex: 1 },
    { field: 'firstBetTime', headerName: 'Time', flex: 1 },
  ], []);

  // Сортировка данных
  const sortedData = useMemo(() => {
    if (!data || data.items.length === 0) return [];
    if (!sortModel || sortModel.length === 0) return data.items;

    const { field, sort } = sortModel[0];

    const sorted = [...data.items].sort((a, b) => {
      let valueA = a[field as keyof SessionInfo];
      let valueB = b[field as keyof SessionInfo];

      // eslint-disable-next-line max-len
      const isNumeric = (val: any) => typeof val === 'number' || (typeof val === 'string' && !Number.isNaN(parseFloat(val)) && Number.isFinite(val));

      if (isNumeric(valueA)) {
        valueA = parseFloat(valueA.toString());
        valueB = parseFloat(valueB.toString());
      } else {
        valueA = valueA?.toString().toLowerCase() ?? '';
        valueB = valueB?.toString().toLowerCase() ?? '';
      }

      if (valueA < valueB) return sort === 'asc' ? -1 : 1;
      if (valueA > valueB) return sort === 'asc' ? 1 : -1;

      return 0;
    });
    return sorted;
  }, [data, sortModel]);

  return (
    <div>
      <TableGridLocalSort
        data={sortedData} // Передаем отсортированные данные
        rowCountState={data?.totalItemsCount}
        rowId={(row: Row) => `${row.partnerId}-${row.playerId}-${row.sessionId}`}
        isLoading={isLoading || isLoadingMutate}
        error={error as Error}
        columns={columns}
        handleRowClick={handleRowClick}
        title="Player-session Table"
        sortModel={sortModel}
        onSortModelChange={handleSortChange}
        onFilterModelChange={handleFilterModelChange} // Добавляем обработку фильтров
      />
    </div>
  );
};

export default Sessions2;
