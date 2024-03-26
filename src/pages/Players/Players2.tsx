import React, { FC, useMemo } from 'react';
import {
  useLocation, useNavigate,
} from 'react-router-dom';
import { GridColDef } from '@mui/x-data-grid';
import TableGrid from 'widgets/tableGrid/ui/TableGrid';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { Player } from 'features/players/types/types';
import { postPlayersData } from 'features/players/api';

interface Row {
  partnerId: string;
  playerId: string;
  sessionId: string;
}

const Players2: FC = () => {
  const { search, state } = useLocation();
  const params = new URLSearchParams(search);
  const partnerId = params.get('id');

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
    data,
    isLoading,
    error,
    refetch,
  } = useDataRequest<Player[]>('players', () => postPlayersData({
    partnerId,
    paginationModel,
    sortModel,
    filterModel,
    filterDate,
  }));
  const columns: GridColDef[] = useMemo(() => [
    { field: 'playerId', headerName: 'Player ID', flex: 1 },
    { field: 'sessionId', headerName: 'Session ID', flex: 1 },
    { field: 'currencyName', headerName: 'Currency Name', flex: 1 },
    { field: 'gameName', headerName: 'Game Name', flex: 1 },
    { field: 'totalActions', headerName: 'Total Actions', flex: 1 },
    { field: 'totalAmountBet', headerName: 'Total Amount Bet', flex: 1 },
    { field: 'totalAmountWin', headerName: 'Total Amount Win', flex: 1 },
    { field: 'totalProfit', headerName: 'Total Profit', flex: 1 },
    { field: 'totalProfitUSD', headerName: 'Total Profit USD', flex: 1 },
  ], []);
  const rowId = (row: Row) => `${row.partnerId}-${row.playerId}-${row.sessionId}`;
  const handleRowClick = (row: Record<string, number>) => {
    if (row.sessionId) {
      navigate(`/partners/players/sessions/?id=${row.sessionId}`, { state: { ...state, Players: search } });
    }
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

export default Players2;
