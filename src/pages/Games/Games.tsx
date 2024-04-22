import React, { FC, useCallback } from 'react';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { GridColDef, GridRowParams } from '@mui/x-data-grid';
import { paths } from 'shared/lib/consts/paths';
import { DataGridPro } from '@mui/x-data-grid-pro';

const Games: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // const error = { message: '' };
  const isLoading = false;
  const data: Record<string, any>[] = [
    {
      gameID: 1, gameName: 'Comet Crash', partnerId: 1, crash: 'USD', partnerName: 'Partner 1',
    },
    {
      gameID: 2, gameName: 'Dice', partnerId: 2, dice: 'USD', partnerName: 'Partner 2',
    },
    {
      gameID: 3, gameName: 'Double', partnerId: 3, double: 'USD', partnerName: 'Partner 3',
    },
    {
      gameID: 4, gameName: 'Passage', partnerId: 4, passage: 'USD', partnerName: 'Partner 4',
    },
  ];
  const columns: GridColDef[] = [
    {
      field: 'partnerName', headerName: '#', flex: 1,
    },
    {
      field: 'crash', headerName: 'Comet Crash', flex: 1,
    },
    {
      field: 'dice', headerName: 'Dice', flex: 1,
    },
    {
      field: 'double', headerName: 'Double', flex: 1,
    },
    {
      field: 'passage', headerName: 'Passage', flex: 1,
    },
  ];

  const handleRowClick = useCallback((row: Record<string, number>) => {
    if (row.partnerId) {
      queryClient.invalidateQueries({ queryKey: 'partners' })
        .then(() => {
          console.log('Handle Row Click');
          navigate(`${paths.partners}`);
        });
    }
  }, [queryClient, navigate]);
  const rowId = (row: Record<string, number>) => {
    console.log('Row ID');
    return `${row.partnerId}-${row.gameName}`;
  };

  const handleRowClickWrapper = ((params: GridRowParams) => {
    if (handleRowClick) handleRowClick(params.row);
  });
  console.log('Before Return');
  return (
    <Box>
      <DataGridPro
        rows={data}
        getRowId={rowId}
        loading={isLoading}
        columns={columns}
        onRowClick={handleRowClickWrapper}
      />
    </Box>
  );
};

export default Games;
