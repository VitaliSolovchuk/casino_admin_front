/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  FC,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  GridColDef,
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

type pagination = {
  pageSize: number;
  page: number;
};

interface TableGridProps {
  data?: Record<string, any>[];
  isLoading: boolean;
  error: Error;
  refetch: () => void;
  columns: GridColDef[];
  rowId?: GridRowIdGetter<any>;
  paginationModel: pagination;
  setPaginationModel: Dispatch<SetStateAction<pagination>>;
  sortModel: Record<string, any>;
  setSortModel: Dispatch<SetStateAction<Record<string, any>>>;
  filterModel: Record<string, any>;
  setFilterModel: Dispatch<SetStateAction<Record<string, any>>>;
  title: string;
}

const TableGrid: FC<TableGridProps> = ({
  data,
  isLoading,
  error,
  refetch,
  columns,
  rowId,
  paginationModel,
  setPaginationModel,
  sortModel,
  setSortModel,
  filterModel,
  setFilterModel,
  title,
}) => {
  const [localFilter, setLocalFilter] = useState<Record<string, any>>({
    items: [],
  });

  const rowCountState = data ? data.length : 0;

  console.log(localFilter);

  useEffect(() => {
    refetch();
  }, [paginationModel, sortModel, filterModel]);

  const handleApplyFilter = useCallback(() => {
    setFilterModel((prevFilterModel) => ({
      ...prevFilterModel,
      ...localFilter,
    }));
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
        currentFilters={filterModel}
        onFilterChange={setFilterModel}
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
        components={{ Toolbar: GridToolbar, FilterPanel: CustomFilterPanel }}
      />
    </div>
  );
};

export default TableGrid;
