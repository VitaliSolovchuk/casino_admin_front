import React, {
  FC, useEffect, useMemo, useRef,
} from 'react';
import { GridColDef } from '@mui/x-data-grid';
import TableGrid from 'widgets/tableGrid/ui/TableGrid';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { PartnerData } from 'features/partners/types/types';
import { postGamesData } from 'features/partners/api';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';

interface Row {
  partnerId: number;
  currencyName: string;
}

const Games: FC = () => {
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
  } = useDataRequest<PartnerData>(
    'games',
    () => postGamesData({
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
    'games',
    () => postGamesData(
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

  // totalUniquePlayers: number;
  // totalSessions: number;
  // totalActions: number;
  // currencyName: string;
  // gameName: string;
  // currencyId: number;

  // RTP: string;
  // totalGGRUSD: Decimal;
  // totalAmountBetUSD: Decimal;
  // totalAmountWinUSD: Decimal;

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'gameName',
      headerName: 'Game',
      flex: 1,
    },
    {
      field: 'totalUniquePlayers',
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
      field: 'totalAmountBetUSD',
      headerName: 'Total Bet',
      flex: 1,
    },
    {
      field: 'totalAmountWinUSD',
      headerName: 'Total Win',
      flex: 1,
    },
    {
      field: 'totalGGRUSD',
      headerName: 'Total Profit USD',
      flex: 1,
    },
    {
      field: 'RTP',
      headerName: 'RTP %',
      flex: 1,
    },
  ], []);
  const rowId = (row: Row) => `${row.partnerId}-${row.currencyName}`;
  return (
    <div>
      <TableGrid
        data={data?.partnerCurrencyStatistic}
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
