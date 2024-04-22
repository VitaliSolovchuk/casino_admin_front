import React, {
  FC,
} from 'react';
import { useLocation } from 'react-router-dom';
import TableGrid from 'widgets/tableGrid/ui/TableGrid';
import useSessionsDataHook from 'features/sessions/model';
import Box from '@mui/material/Box';
import { columns } from '../lib/columns';

interface Row {
  dataTime: string
}

const SessionEvents: FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const sessionId = params.get('id');

  const {
    data,
    isLoading,
    error,
  } = useSessionsDataHook(sessionId);

  const rowId = (row: Row) => row.dataTime;
  return (
    <Box>
      <TableGrid
        data={data}
        rowId={rowId}
        isLoading={isLoading}
        error={error as Error}
        columns={columns}
        title="Session Table"
      />
    </Box>
  );
};

export default SessionEvents;
