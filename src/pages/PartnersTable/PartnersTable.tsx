import React, { FC, useEffect, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import TableGrid from '../../widgets/tableGrid/ui/TableGrid';

// import { data } from './fakeData';

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

const PartnersTable: FC = () => {
  const [filterModel, setFilterModel] = useState<Record<string, any>>({
    items: [],
  });
  const [sortModel, setSortModel] = useState<Record<string, any>>([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });
  const [test, setTest] = useState();
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
        const response = await axios.post(
          'https://dev.jetgames.io/admin-panel/partners',
          {
            page: paginationModel.page,
            pageSize: paginationModel.pageSize,
            sortModel,
            filterModel,
          },
        );
        setTest(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchPartners();
  }, [paginationModel, sortModel, filterModel]);
  console.log(test);

  const columns: GridColDef[] = [
    {
      field: 'partnerName',
      headerName: 'Partner Name',
      flex: 1,
      renderCell: (params) => (
        <Link to={`/partners/${params.row.partnerId}`}>
          {params.row.partnerName}
        </Link>
      ),
    },
    { field: 'currencyName', headerName: 'Currency Name', flex: 1 },
    { field: 'sessionCount', headerName: 'Session Count', flex: 1 },
    { field: 'totalActions', headerName: 'Total Actions', flex: 1 },
    { field: 'totalAmountBet', headerName: 'Total Amount Bet', flex: 1 },
    { field: 'totalAmountWin', headerName: 'Total Amount Win', flex: 1 },
    { field: 'totalProfit', headerName: 'Total Profit', flex: 1 },
  ];
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
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        sortModel={sortModel}
        setSortModel={setSortModel}
        filterModel={filterModel}
        setFilterModel={setFilterModel}
        title="Partners Table"
      />
    </div>
  );
};

export default PartnersTable;
