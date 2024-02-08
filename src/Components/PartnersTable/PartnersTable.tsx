import React, { FC, useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Partner {
  partnerId: string;
  partnerName: string;
  currencyName: string;
  sessionCount: number;
  totalActions: number;
  totalAmountBet: number;
  totalAmountWin: number;
  totalProfit: number;
}

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

const PartnersTable: FC = () => {
  const [partnersData, setPartnersData] = useState<Partner[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://dev.jetgames.io/admin-panel/partners');
        setPartnersData(response.data);
      } catch (error) {
        console.error('Error fetching partners data:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <DataGrid
        rows={partnersData}
        columns={columns}
        // pageSize={25}
        // rowsPerPageOptions={[10, 25, 50, 100]}
        pagination
        autoHeight
        // disableSelectionOnClick
        getRowId={(row) => `${row.partnerId}-${row.currencyName}`}
      />
    </div>
  );
};

export default PartnersTable;
