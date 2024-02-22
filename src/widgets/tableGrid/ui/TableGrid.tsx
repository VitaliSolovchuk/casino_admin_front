/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  FC,
  useEffect,
  useCallback,
} from 'react';
import {
  GridColDef, GridFilterModel,
  GridFilterPanel,
  GridRowIdGetter,
  GridToolbar,
} from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { Button } from '@mui/material';
import Spinner from 'shared/ui/Spinner/Spinner';
import PageTitle from 'entities/pageTitle/ui/PageTitle';
import DateRangeFilter from 'entities/dateRangeCalendar/ui/DateRangeFilter';
import styles from './TableGrid.module.scss';
import useTableGrid from '../model/tableGridStore';

interface TableGridProps {
  data?: Record<string, any>[];
  isLoading: boolean;
  error: Error;
  refetch: () => void;
  columns: GridColDef[];
  rowId?: GridRowIdGetter<any>;
  title: string;
  handleRowClick?: ({ id }: {id: number}) => void
}

const TableGrid: FC<TableGridProps> = ({
  data,
  isLoading,
  error,
  refetch,
  columns,
  rowId,
  title,
  handleRowClick,
}) => {
  const [localFilter, setLocalFilter] = useState<GridFilterModel>({
    items: [],
    quickFilterValues: [],
  });
  const {
    setFilterModel,
    paginationModel,
    sortModel,
    setSortModel,
    setPaginationModel,
    filterModel,
  } = useTableGrid((state) => state);

  const rowCountState = data ? data.length : 0;

  useEffect(() => {
    refetch();
  }, [paginationModel, sortModel, filterModel]);

  const handleApplyFilter = useCallback(() => {
    setFilterModel(localFilter);
  }, [localFilter, setFilterModel]);

  const CustomFilterPanel = useCallback(
    ({ ...props }) => (
      <div>
        <GridFilterPanel {...props} />
        <Button onClick={handleApplyFilter} className={styles.button}>
          Confirm
        </Button>
      </div>
    ),
    [localFilter],
  );

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
      <PageTitle title={title} />
      <DateRangeFilter
        onSubmit={refetch}
      />
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
        sx={{
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
          },
        }}
        paginationModel={paginationModel}
        rows={data || []}
        columns={columns}
        rowCount={rowCountState}
        pagination
        autoHeight
        getRowId={rowId}
        sortingMode="server"
        filterMode="server"
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={setSortModel}
        onFilterModelChange={setLocalFilter}
        loading={isLoading}
        onRowClick={(params) => handleRowClick && handleRowClick(params.row)}
        components={{ Toolbar: GridToolbar, FilterPanel: CustomFilterPanel }}
      />
    </div>
  );
};

export default TableGrid;
