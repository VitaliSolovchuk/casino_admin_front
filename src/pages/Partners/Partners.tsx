import React, {
  FC, useEffect, useMemo, useRef, useState,
} from 'react';
import { GridColDef, GridSortModel } from '@mui/x-data-grid';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { PartnerData, PartnerCurrencyStatistic } from 'features/partners/types/types';
import { useQueryClient } from 'react-query';
import { postPartnersStatisticData } from 'features/partners/api';
import { paths } from 'shared/lib/consts/paths';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';
import TableGridLocalSort from 'widgets/tableGrid/ui/TableGridLocalSort';

interface Row {
  partnerId: number;
  currencyName: string;
}

const Partners: FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const partnerId = params.get('id');

  const {
    filterModel,
    // sortModel,
    paginationModel,
  } = useTableGrid((state) => state);

  const {
    filterDate,
  } = useFilterDateRange((state) => state);

  const { dateRange } = filterDate;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isFirstRender = useRef(true);

  const {
    data,
    isLoading,
    error,
  } = useDataRequest<PartnerData>(
    'partners',
    () => postPartnersStatisticData({
      partnerId,
      paginationModel,
      // sortModel,
      filterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
    }),
  );

  const { mutate, isLoading: isLoadingMutate } = useMutationRequest<PartnerData>(
    'partners',
    () => postPartnersStatisticData(
      {
        partnerId,
        paginationModel,
        // sortModel,
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

  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'ggrUsd', sort: 'desc' }]);

  const sortedData = useMemo(() => {
    if (!data || data.currencyStatistics.length === 0) return [];
    if (!sortModel || sortModel.length === 0) return data.currencyStatistics;

    const { field, sort } = sortModel[0];

    const sorted = [...data.currencyStatistics].sort((a, b) => {
      let valueA = a[field as keyof PartnerCurrencyStatistic];
      let valueB = b[field as keyof PartnerCurrencyStatistic];

      // число в строке
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

  const handleSortChange = (model: GridSortModel) => {
    setSortModel(model);
  };

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'partnerName',
      headerName: 'Partner',
      flex: 1,
    },
    {
      field: 'currencyName',
      headerName: 'Currency',
      flex: 1,
    },
    {
      field: 'totalPlayers',
      headerName: 'Players',
      flex: 1,
    },
    {
      field: 'totalSessions',
      headerName: 'Sessions',
      flex: 1,
    },
    {
      field: 'totalActions',
      headerName: 'Actions',
      flex: 1,
    },
    {
      field: 'totalAmountBetUsd',
      headerName: 'Bet Usd',
      flex: 1,
    },
    {
      field: 'totalAmountWinUsd',
      headerName: 'Win Usd',
      flex: 1,
    },
    {
      field: 'ggrUsd',
      headerName: 'Profit USD',
      flex: 1,
    },
    {
      field: 'rtp',
      headerName: 'RTP %',
      flex: 1,
    },
  ], []);

  const handleRowClick = (row: Record<string, number>) => {
    if (row.partnerId) {
      queryClient.invalidateQueries({ queryKey: 'players' })
        .then(() => navigate(`${paths.players}/?id=${row.partnerId}&currency=${row.currencyName}`));
    }
  };
  const rowId = (row: Row) => `${row.partnerId}-${row.currencyName}`;
  return (
    <div>
      <TableGridLocalSort
        data={sortedData}
        rowId={rowId}
        isLoading={isLoading || isLoadingMutate}
        error={error as Error}
        columns={columns}
        handleRowClick={handleRowClick}
        title="Partners Table"
        sortModel={sortModel}
        onSortModelChange={handleSortChange}
      />
    </div>
  );
};
export default Partners;
