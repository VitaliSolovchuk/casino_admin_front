import React, {
  FC, useEffect, useMemo, useRef, useState, useContext,
} from 'react';
import { GridColDef, GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { PartnerCurrensyData, PartnerCurrency } from 'features/partners/types/types';
import { useQueryClient } from 'react-query';
import { postPartnersCurrenseStatisticData } from 'features/partners/api';
import { paths } from 'shared/lib/consts/paths';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';
import TotalGGRContext from '../../TotalGGRContext';
import TableGrid from '../../shared/ui/TableGrid/TableGrid';

interface Row {
  partnerId: number;
  currencyName: string;
}

const PartnerCurrenсy: FC = () => {
  const { paginationModel } = useTableGrid((state) => state);
  const hasMounted = useRef(false);
  const { filterDate } = useFilterDateRange((state) => state);
  const { dateRange } = filterDate;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setTotalGgrUsd } = useContext(TotalGGRContext);

  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'ggrUsd', sort: 'desc' }]);
  const [localFilterModel, setLocalFilterModel] = useState<GridFilterModel>({ items: [], quickFilterValues: [] });

  const {
    data,
    isLoading,
    error,
  } = useDataRequest<PartnerCurrensyData>(
    'partner-currency',
    () => postPartnersCurrenseStatisticData({
      paginationModel,
      // sortModel,
      filterModel: localFilterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
    }),
  );

  const { mutate, isLoading: isLoadingMutate } = useMutationRequest<PartnerCurrensyData>(
    'partner-currency',
    () => postPartnersCurrenseStatisticData(
      {
        paginationModel,
        // sortModel,
        filterModel: localFilterModel,
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
    if (hasMounted.current) {
      mutate();
    } else {
      hasMounted.current = true;
    }
  }, [mutate, paginationModel, localFilterModel, filterDate, dateRange]);

  const sortedData = useMemo(() => {
    if (!data || data.statistics.length === 0) return [];
    if (!sortModel || sortModel.length === 0) return data.statistics;

    const { field, sort } = sortModel[0];

    const sorted = [...data.statistics].sort((a, b) => {
      let valueA = a[field as keyof PartnerCurrency];
      let valueB = b[field as keyof PartnerCurrency];

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
      headerName: 'Total Bet (USD)',
      flex: 1,
    },
    {
      field: 'totalAmountWinUsd',
      headerName: 'Total Win (USD)',
      flex: 1,
    },
    {
      field: 'ggrUsd',
      headerName: 'GGR (USD)',
      flex: 1,
    },
    {
      field: 'rtp',
      headerName: 'RTP (%)',
      flex: 1,
    },
  ], []);

  const handleRowClick = (row: Record<string, number>) => {
    if (row.partnerId) {
      queryClient.invalidateQueries({ queryKey: 'partners' })
        .then(() => navigate(`${paths.partners}/?id=${row.partnerId}`));
    }
  };
  const rowId = (row: Row) => `${row.partnerId}-${row.currencyName}`;
  return (
    <div>
      <TableGrid
        rowCountState={sortedData.length}
        data={sortedData}
        rowId={rowId}
        isLoading={isLoading || isLoadingMutate}
        error={error as Error}
        columns={columns}
        handleRowClick={handleRowClick}
        title="Partners Table"
        sortModel={sortModel}
        onSortModelChange={handleSortChange}
        setLocalFilterModel={setLocalFilterModel}
      />
    </div>
  );
};
export default PartnerCurrenсy;
