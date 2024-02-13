import React, {
  FC, useState,
} from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import Spinner from 'shared/ui/Spinner/Spinner';

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
  const { data, isLoading, error } = useQuery<PartnerData[]>(
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

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });

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

  if (isLoading) return <Spinner />;
  if (error) {
    return (
      <div>
        Error fetching partners data:
        {(error as Error).message}
      </div>
    );
  }
  return (
    <div>
      <DataGrid
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={data || []}
        columns={columns}
        pagination
        autoHeight
        getRowId={(row) => `${row.partnerId}-${row.currencyName}`}
      />
    </div>
  );
};

export default PartnersTable;
