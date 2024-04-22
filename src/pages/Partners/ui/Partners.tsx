import React, {
  FC,
} from 'react';
import TableGrid from 'widgets/tableGrid/ui/TableGrid';
import usePartnersDataHook from 'features/partners/model';
import Box from '@mui/material/Box';
import { columns } from '../lib/columns';

interface Row {
  partnerId: number;
  currencyName: string;
}

const Partners: FC = () => {
  const {
    data,
    isLoading,
    error,
    handleRowClick,
  } = usePartnersDataHook();

  const rowId = (row: Row) => `${row.partnerId}-${row.currencyName}`;
  return (
    <Box>
      <TableGrid
        data={data}
        rowId={rowId}
        isLoading={isLoading}
        error={error as Error}
        columns={columns}
        handleRowClick={handleRowClick}
        title="Partners Table"
      />
    </Box>
  );
};
export default Partners;
