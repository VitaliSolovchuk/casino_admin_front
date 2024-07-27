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
import { postStatisticData } from 'features/partners/api';
import { paths } from 'shared/lib/consts/paths';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';

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
    () => postStatisticData({
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
    () => postStatisticData(
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

  // {
  //   "totalAmountBet": "1.6200",
  //   "totalAmountWin": "3.1200",
  //   "totalUniquePlayers": 2,
  //   "totalSessions": 2,
  //   "totalActions": 2,
  //   "partnerName": "coinsbet",
  //   "currencyName": "USD",
  //   "partnerId": 5,
  //   "currencyId": 1,
  //   "date": "2024-07-18T00:00:00.000Z",
  //   "totalGGR": "-1.500",
  //   "totalGGRUSD": "-1.5",
  //   "RTP": "192.59",
  //   "totalAmountBetUSD": "1.62",
  //   "totalAmountWinUSD": "3.12"
  // }

  // V2
  // https://prod.jetgames.io/admin-panel-statistics/get-grouped-by-currency
  // {
  //   "partnerId": 5,
  //   "partnerName": "coinsgame",
  //   "currencyId": 3,
  //   "currencyName": "RUB",
  //   "totalPlayers": 15,
  //   "totalSessions": 25,
  //   "totalActions": 921,
  //   "totalAmountBet": "36390.",
  //   "totalAmountWin": "31609.",
  //   "totalAmountBetUsd": "422.86",
  //   "totalAmountWinUsd": "367.30",
  //   "ggr": "4780.8",
  //   "ggrUsd": "55.550",
  //   "rtp": "86.86",
  //   "day": "2024-07-27T00:00:00.000Z"
  // },

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
    // {
    //   field: 'totalProfit',
    //   headerName: 'Total Profit',
    //   flex: 1,
    // },
    {
      field: 'ggr',
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
