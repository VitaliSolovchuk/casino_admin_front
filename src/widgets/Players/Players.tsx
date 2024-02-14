/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, FC, useEffect, useCallback,
} from 'react';
import { Link, useParams } from 'react-router-dom';
import { GridColDef, GridFilterPanel, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import { useQuery } from 'react-query';
import Spinner from 'shared/ui/Spinner/Spinner';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { Button } from '@mui/material';
import styles from './Players.module.scss';

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
type pagination = {
  pageSize: number,
  page: number
}
const Players: FC = () => {
  const { partnerId } = useParams<routeParams>();
  const [paginationModel, setPaginationModel] = useState<pagination>({
    pageSize: 25,
    page: 0,
  });
  const [filterModel, setFilterModel] = useState<Record<string, any>>({ items: [] });
  const [sortModel, setSortModel] = useState<Record<string, any>>([]);
  const [localFilter, setLocalFilter] = useState<Record<string, any>>({ items: [] });
  const {
    data, isLoading, error, refetch,
  } = useQuery<Player[]>(
    'players',
    async () => {
      const response = await axios.get<Player[]>(
        `https://dev.jetgames.io/admin-panel/players-for-partner?partnerId=${partnerId}`,
        {
          params: {
            page: paginationModel.page,
            pageSize: paginationModel.pageSize,
            sortModel,
            filterModel,
          },
        },
      );
      return response.data;
    },
    {
      cacheTime: 10 * 60 * 1000,
      staleTime: 10 * 60 * 1000,
    },
  );

  useEffect(() => {
    refetch();
  }, [paginationModel, sortModel, filterModel]);

  const columns: GridColDef[] = [
    { field: 'playerId', headerName: 'Player ID', flex: 1 },
    {
      field: 'sessionId',
      headerName: 'Session ID',
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

  const rowCountState = data ? data.length : 0;

  // const handleFilter = useCallback((items: SetStateAction<Record<string, any>>) => {
  //   setFilterModel(items);
  // }, []);
  // const handlePagination = useCallback((items: Record<string, any>) => {
  //   setPaginationModel((prev) => ({ ...prev, ...items }));
  // }, []);
  // const handleSort = useCallback((items: Record<string, any>) => {
  //   setSortModel((prev) => ({ ...prev, ...items }));
  // }, []);

  const CustomFilterPanel = useCallback(({ ...props }) => {
    const handleApplyFilter = () => {
      setFilterModel(localFilter);
    };

    return (
      <div>
        <GridFilterPanel {...props} />
        <Button
          onClick={handleApplyFilter}
          className={styles.button}
        >
          Confirm
        </Button>
      </div>
    );
  }, [localFilter]);

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
        // slotProps={{
        //   filterPanel: {
        //     filterFormProps: {
        //       operatorInputProps: {
        //         disabled: true, // If you only want to disable the operator
        //         sx: { display: 'none' }, // If you want to remove it completely
        //       },
        //     },
        //   },
        // }}
        filterDebounceMs={300}
        paginationModel={paginationModel}
        rows={data || []}
        columns={columns}
        rowCount={rowCountState}
        pagination
        autoHeight
        getRowId={(row) => `${row.partnerId}-${row.playerId}-${row.sessionId}`} // Use a unique identifier
        sortingMode="server"
        filterMode="server"
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={setSortModel}
        onFilterModelChange={setLocalFilter}
        loading={isLoading}
        components={{ Toolbar: GridToolbar, FilterPanel: CustomFilterPanel }}
      />
    </div>
  );
};

export default Players;
