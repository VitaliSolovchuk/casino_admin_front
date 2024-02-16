import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import {
  DataGrid, GridColDef, GridFilterPanel, GridToolbar,
} from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Button } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import Spinner from '../../shared/ui/Spinner/Spinner';
import PageTitle from '../../entities/pageTitle/ui/PageTitle';
import styles from '../Players/Players.module.scss';

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
  const [filterModel, setFilterModel] = useState<Record<string, any>>({ items: [] });
  const [sortModel, setSortModel] = useState<Record<string, any>>([]);
  const [localFilter, setLocalFilter] = useState<Record<string, any>>({ items: [] });
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
    // refetch();
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

  const rowCountState = data ? data.length : 0;

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
      <PageTitle title="Partners Table" />
      <DataGridPro
        paginationModel={paginationModel}
        rows={data || []}
        columns={columns}
        pagination
        autoHeight
        getRowId={(row) => `${row.partnerId}-${row.currencyName}`}
        sortingMode="server"
        filterMode="server"
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={setSortModel}
        onFilterModelChange={setLocalFilter}
        loading={isLoading}
        rowCount={rowCountState}
        components={{ Toolbar: GridToolbar, FilterPanel: CustomFilterPanel }}
      />
    </div>
  );
};

export default PartnersTable;
