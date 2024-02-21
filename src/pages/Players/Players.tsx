/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { useQuery } from 'react-query';
import TableGrid from '../../widgets/tableGrid/ui/TableGrid';

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
  partnerId: string;
};
type pagination = {
  pageSize: number;
  page: number;
};

const Players: FC = () => {
  const { partnerId } = useParams<routeParams>();
  const [paginationModel, setPaginationModel] = useState<pagination>({
    pageSize: 25,
    page: 0,
  });
  const [filterModel, setFilterModel] = useState<Record<string, any>>({
    items: [],
  });
  const [sortModel, setSortModel] = useState<Record<string, any>>([]);

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

  const columns: GridColDef[] = [
    { field: 'playerId', headerName: 'Player ID', flex: 1 },
    {
      field: 'sessionId',
      headerName: 'Session ID',
      flex: 1,
      renderCell: (params) => (
        <Link
          to={`/partners/${partnerId}/players/${params.row.playerId}/sessions/${params.row.sessionId}`}
        >
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
  const rowId = (row: { partnerId: any; playerId: any; sessionId: any }) => `${row.partnerId}-${row.playerId}-${row.sessionId}`;

  return (
    <div>
      <TableGrid
        data={data}
        rowId={rowId}
        isLoading={isLoading}
        error={error as Error}
        refetch={refetch}
        columns={columns}
        // paginationModel={paginationModel}
        // setPaginationModel={setPaginationModel}
        // sortModel={sortModel}
        // setSortModel={setSortModel}
        // filterModel={filterModel}
        // setFilterModel={setFilterModel}
        title="Players Table"
      />
    </div>
  );
};

export default Players;
