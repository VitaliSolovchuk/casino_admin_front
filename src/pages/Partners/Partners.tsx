import React, {
  FC, useEffect, useMemo, useRef,
} from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import TableGrid from 'widgets/tableGrid/ui/TableGrid';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { PartnerData } from 'features/partners/types/types';
import { useQueryClient } from 'react-query';
import { postPartnersData } from 'features/partners/api';
import { paths } from 'shared/lib/consts/paths';
import { useMutationRequest } from '../../shared/lib/hooks/useMutationRequest';

interface Row {
  partnerId: number;
  currencyName: string;
}

const Partners: FC = () => {
  const {
    filterModel,
    sortModel,
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
    () => postPartnersData({
      paginationModel,
      sortModel,
      filterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
    }),
  );

  const { mutate } = useMutationRequest<PartnerData>(
    'partners',
    () => postPartnersData(
      {
        paginationModel,
        sortModel,
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
      field: 'totalAmountBet',
      headerName: 'Total Bet',
      flex: 1,
    },
    {
      field: 'totalAmountWin',
      headerName: 'Total Win',
      flex: 1,
    },
    {
      field: 'totalProfit',
      headerName: 'Total Profit',
      flex: 1,
    },
    {
      field: 'totalProfitUSD',
      headerName: 'Total Profit USD',
      flex: 1,
    },
    {
      field: 'RTP',
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
      <TableGrid
        data={data?.partnerCurrencyStatistic}
        rowId={rowId}
        isLoading={isLoading}
        error={error as Error}
        columns={columns}
        handleRowClick={handleRowClick}
        title="Partners Table"
      />
    </div>
  );
};
export default Partners;
