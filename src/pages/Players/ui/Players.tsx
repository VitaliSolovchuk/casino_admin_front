import React, {
  FC,
} from 'react';
import {
  useLocation,
} from 'react-router-dom';
import TableGrid from 'widgets/tableGrid/ui/TableGrid';
import usePlayersDataHook from 'features/players/model';
import Box from '@mui/material/Box';
import { columns } from '../lib/columns';

interface Row {
  partnerId: string;
  playerId: string;
  sessionId: string;
}

const Players: FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const partnerId = params.get('id');
  const currency = params.get('currency');

  const {
    data,
    isLoading,
    error,
    handleRowClick,
  } = usePlayersDataHook(partnerId, currency);
  const rowId = (row: Row) => `${row.partnerId}-${row.playerId}-${row.sessionId}`;

  return (
    <Box>
      <TableGrid
        data={data}
        rowId={rowId}
        isLoading={isLoading}
        error={error as Error}
        columns={columns}
        handleRowClick={handleRowClick}
        title="Players Table"
      />
    </Box>
  );
};

export default Players;
