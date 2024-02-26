import React, { FC, useEffect } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import TableGrid from '../../widgets/tableGrid/ui/TableGrid';
import useTableGrid from '../../widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from '../../entities/dateRangeCalendar/model/dateRangeStore';

interface PartnerData {
  partnerId: number;
  partnerName: string;
  currencyName: string;
  uniquePlayers: Record<string, any>;
  totalPlayers: number;
  sessionCount: number;
  totalActions: number;
  totalAmountBet: number;
  totalAmountWin: number;
  totalProfit: number;
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
    data, isLoading, error, refetch,
  } = useQuery<PartnerData[]>(
    'partners',
    async () => {
      const response = await axios.get<PartnerData[]>(
        'https://dev.jetgames.io/admin-panel/partners',
      );
      return response.data;
    },
    {
      cacheTime: 10 * 60 * 1000,
      staleTime: 10 * 60 * 1000,
    },
  );
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        await axios.post(
          'https://dev.jetgames.io/admin-panel/partners',
          {
            paginationModel,
            sortModel,
            filterModel,
            filterDate: {
              startDate: dateRange[0],
              endDate: dateRange[1],
            },
          },
        );
      } catch (e) {
        console.log(e);
      }
    };
    fetchPartners();
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
    navigate(`/partners/players/?id=${row.partnerId}`);
  };
  const rowId = (row: { partnerId: any; currencyName: any }) => `${row.partnerId}-${row.currencyName}`;
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
