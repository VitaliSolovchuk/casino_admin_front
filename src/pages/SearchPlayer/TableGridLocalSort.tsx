import React, {
  useState,
  FC,
  useRef,
  useEffect,
} from 'react';
import {
  GridColDef,
  GridFilterModel,
  GridFilterPanel,
  GridRowIdGetter,
  GridRowParams,
  GridToolbar,
  GridSortModel,
} from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { Button, Typography } from '@mui/material';
import Spinner from 'shared/ui/Spinner/Spinner';
import DateRangeFilter from 'entities/dateRangeCalendar/ui/DateRangeFilter';
import { useMediaQuery } from 'react-responsive';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import styles from './TableGrid.module.scss';

  interface TableGridProps {
    data?: Record<string, any>[];
    isLoading: boolean;
    error: Error;
    columns: GridColDef[];
    rowId?: GridRowIdGetter<any>;
    title: string;
    handleRowClick?: ({ id }: { id: number }) => void;
    sortModel: GridSortModel;
    onSortModelChange: (model: GridSortModel) => void;
    rowCountState?:number;
    showDateRangeFilter?: boolean; // Новый пропс для управления видимостью календаря
  }

const TableGridLocalSort: FC<TableGridProps> = ({
  data,
  isLoading,
  error,
  columns,
  rowId,
  title,
  handleRowClick,
  sortModel,
  onSortModelChange,
  rowCountState,
  showDateRangeFilter = true, // Устанавливаем значение по умолчанию в true
}) => {
  const [localFilter, setLocalFilter] = useState<GridFilterModel>({ items: [], quickFilterValues: [] });
  const {
    filterModel,
    resetFilterModel,
    setFilterModel,
    paginationModel,
    setPaginationModel,
  } = useTableGrid((state) => state);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const handleApplyFilter = () => {
    setFilterModel(localFilter);
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const CustomFilterPanel: FC = () => {
    const filterPanelRef = useRef<HTMLDivElement>(null);
    const shouldShowConfirmButton = localFilter.items.length > 0 && localFilter.items.every((item) => item.value);
    useEffect(() => {
      const buttons = filterPanelRef.current?.querySelectorAll('.MuiDataGrid-panelFooter button');
      const removeAllButton = buttons?.item(1);

      if (removeAllButton instanceof HTMLButtonElement) {
        removeAllButton.addEventListener('click', () => {
          if (filterModel.items.length > 0) {
            setTimeout(() => resetFilterModel());
          }
        });
      }
    }, []);

    return (
      <div>
        <GridFilterPanel ref={filterPanelRef} />
        {shouldShowConfirmButton && (
          <Button onClick={handleApplyFilter} className={styles.button}>
            Confirm
          </Button>
        )}
      </div>
    );
  };

  /*  if (isLoading) return <Spinner />; */

  if (error) {
    return (
      <div>
        {error.message}
      </div>
    );
  }

  const handleRowClickWrapper = ((params: GridRowParams) => {
    if (handleRowClick) handleRowClick(params.row);
  });

  return (
    <div>
      <Typography variant="h6" sx={{ mb: 2 }}>{title.toUpperCase()}</Typography>
      {showDateRangeFilter && <DateRangeFilter />}
      {' '}
      {/* Отображаем календарь, только если showDateRangeFilter = true */}
      {!isLoading ? (
        <DataGridPro
          sx={{
            ...(isMobile && {
              '& .MuiDataGrid-cell, .MuiDataGrid-columnHeader': {
                minWidth: '100px !important',
              },
              '& .MuiDataGrid-iconButtonContainer': {
                width: '0 !important',
              },
              mx: -2,
            }),
            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer',
            },
          }}
          filterDebounceMs={2000}
          paginationModel={paginationModel}
          rows={data || []}
          columns={columns}
          rowCount={rowCountState}
          pagination
          autoHeight
          getRowId={rowId}
          pageSizeOptions={[3, 25, 50, 100]}
          sortingMode="client"
          filterMode="server"
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          onSortModelChange={onSortModelChange}
          sortModel={sortModel}
          onFilterModelChange={setLocalFilter}
          loading={isLoading}
          onRowClick={handleRowClickWrapper}
          slots={{
            toolbar: GridToolbar,
            filterPanel: CustomFilterPanel,
          }}
        />
      ) : <Spinner />}
    </div>
  );
};

export default TableGridLocalSort;
