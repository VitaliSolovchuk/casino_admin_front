import React, { useState, FC, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { useQuery } from 'react-query';
import Spinner from 'shared/ui/Spinner/Spinner';
import { DataGridPro } from '@mui/x-data-grid-pro';

interface Player {
  playerId: string;
  sessionId: string;
  currencyName: string;
  gameName: string;
  totalActions: number;
  totalAmountBet: number;
  totalAmountWin: number;
  totalProfit: number;
}
type routeParams = {
  partnerId: string
}
const Players: FC = () => {
  const { partnerId } = useParams<routeParams>();

  const { data, isLoading, error } = useQuery<Player[]>(
    'players',
    async () => {
      const response = await axios.get<Player[]>(
        `https://dev.jetgames.io/admin-panel/players-for-partner?partnerId=${partnerId}`,
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
    { field: 'playerId', headerName: 'Player ID', flex: 1 },
    {
      field: 'sessionId',
      headerName: 'Session ID',
      // filterOperators: getGridStringOperators().filter((operator) => operator.value === 'contains'),
      flex: 1,
      renderCell: (params) => (
        <Link to={`/partners/${partnerId}/players/${params.row.playerId}/sessions/${params.row.sessionId}`}>
          {params.row.sessionId}
        </Link>
      ),
    },
    { field: 'currencyName', headerName: 'Currency Name', flex: 1 },
    { field: 'gameName', headerName: 'Game Name', flex: 1 },
    { field: 'totalActions', headerName: 'Total Actions', flex: 1 },
    { field: 'totalAmountBet', headerName: 'Total Amount Bet', flex: 1 },
    { field: 'totalAmountWin', headerName: 'Total Amount Win', flex: 1 },
    { field: 'totalProfit', headerName: 'Total Profit', flex: 1 },
  ];
  useEffect(() => {
    console.log(paginationModel);
  }, [paginationModel]);

  const handleFilter = ({ items }: Record<string, any>) => {
    console.log(items);
  };
  const handlePagination = (items: Record<string, any>) => {
    setPaginationModel((prev) => ({ ...prev, ...items }));
  };
  const handleSort = (items: Record<string, any>) => {
    console.log(items);
  };

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
      <DataGridPro
        slotProps={{
          filterPanel: {
            filterFormProps: {
              operatorInputProps: {
                disabled: true, // If you only want to disable the operator
                sx: { display: 'none' }, // If you want to remove it completely
              },
            },
          },
        }}
        filterDebounceMs={300}
        paginationModel={paginationModel}
        // onPaginationModelChange={setPaginationModel}
        rows={data || []}
        columns={columns}
        pagination
        autoHeight
        getRowId={(row) => `${row.partnerId}-${row.playerId}-${row.sessionId}`} // Use a unique identifier
        sortingMode="server"
        filterMode="server"
        paginationMode="server"
        onPaginationModelChange={handlePagination}
        onSortModelChange={handleSort}
        onFilterModelChange={handleFilter}
        loading={isLoading}
      />
    </div>
  );
};

export default Players;
