import React, { FC, useEffect } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import TableGrid from 'widgets/tableGrid/ui/TableGrid';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { PartnerData } from 'features/partners/types/types';
import { fetchPartnersData, getPartnersData } from '../../features/partners/api';

interface Row {
  partnerId: number;
  currencyName: string
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

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useDataRequest<PartnerData[]>('partners', getPartnersData);

  useEffect(() => {
    fetchPartnersData({
      paginationModel,
      sortModel,
      filterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
    });
  }, [paginationModel, sortModel, filterModel, filterDate, dateRange]);

  const columns: GridColDef[] = [
    { field: 'partnerName', headerName: 'Partner Name', flex: 1 },
    { field: 'currencyName', headerName: 'Currency Name', flex: 1 },
    { field: 'sessionCount', headerName: 'Session Count', flex: 1 },
    { field: 'totalActions', headerName: 'Total Actions', flex: 1 },
    { field: 'totalAmountBet', headerName: 'Total Amount Bet', flex: 1 },
    { field: 'totalAmountWin', headerName: 'Total Amount Win', flex: 1 },
    { field: 'totalProfit', headerName: 'Total Profit', flex: 1 },
  ];
  const handleRowClick = (row: Record<string, number>) => {
    if (row.partnerId) {
      navigate(`/partners/players/?id=${row.partnerId}`);
    }
  };
  const rowId = (row: Row) => `${row.partnerId}-${row.currencyName}`;
  return (
    <div>
      <TableGrid
        data={data}
        rowId={rowId}
        isLoading={isLoading}
        error={error as Error}
        refetch={refetch}
        columns={columns}
        handleRowClick={handleRowClick}
        title="Partners Table"
      />
    </div>
  );
};

export default Partners;
