import React, { FC } from 'react';
import {
  Link, useLocation, useNavigate, useParams,
} from 'react-router-dom';
import { GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { useQuery } from 'react-query';
import TableGrid from 'widgets/tableGrid/ui/TableGrid';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';

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

const Players: FC = () => {
  const { partnerId } = useParams<routeParams>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const {
    filterModel,
    sortModel,
    paginationModel,
  } = useTableGrid((state) => state);
  const {
    filterDate,
  } = useFilterDateRange((state) => state);
  const {
    data, isLoading, error, refetch,
  } = useQuery<Player[]>(
    'players',
    async () => {
      const response = await axios.get<Player[]>(
        `https://dev.jetgames.io/admin-panel/players-for-partner?partnerId=${partnerId}`,
        {
          params: {
            paginationModel,
            sortModel,
            filterModel,
            filterDate,
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
  const rowId = (
    row: { partnerId: any; playerId: any; sessionId: any },
  ) => `${row.partnerId}-${row.playerId}-${row.sessionId}`;
  const handleRowClick = (row: Record<string, number>) => {
    navigate(`/partners/${partnerId}/players/${row.playerId}/sessions/${row.sessionId}`, { state: `${state}/Players` });
  };
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
        title="Players Table"
      />
    </div>
  );
};

export default Players;
