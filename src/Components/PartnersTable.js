import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

import StyledLink from '../Styles/StyledLink'
import StyledTableContainer from '../Styles/StyledTableContainer'



const columns = [
//   { field: 'partnerId', headerName: 'Partner ID', hide: true, },
  {
    field: 'partnerName',
    headerName: 'Partner Name',
    flex: 1,
    renderCell: (params) => (
      <StyledLink to={`/partners/${params.row.partnerId}`}>
        {params.row.partnerName}
      </StyledLink>
    ),
  },
  { field: 'currencyName', headerName: 'Currency Name', flex: 1 },
  { field: 'sessionCount', headerName: 'Session Count', flex: 1 },
  { field: 'totalActions', headerName: 'Total Actions', flex: 1 },
  { field: 'totalAmountBet', headerName: 'Total Amount Bet', flex: 1 },
  { field: 'totalAmountWin', headerName: 'Total Amount Win', flex: 1 },
  { field: 'totalProfit', headerName: 'Total Profit', flex: 1 },
];

const PartnersTable = ({ partnersData }) => {
  return (
    <StyledTableContainer>
      <DataGrid
        rows={partnersData}
        columns={columns}
        pageSize={25}
        rowsPerPageOptions={[10, 25, 50, 100]}
        pagination
        autoHeight
        disableSelectionOnClick
        getRowId={(row) => `${row.partnerId}-${row.currencyName}`} // Используйте уникальный идентификатор
      />
    </StyledTableContainer>
  );
};

export default PartnersTable;