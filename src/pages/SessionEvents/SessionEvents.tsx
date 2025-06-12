import React, {
  FC, useEffect, useMemo, useState, useRef,
} from 'react';
import { useLocation } from 'react-router-dom';
import { GridColDef, GridFilterModel } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { SessionEvent } from 'features/sessions/types/types';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { postSessionsData } from 'features/sessions/api';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';
import { Box, Tooltip, Typography } from '@mui/material';
import TableGrid from '../../shared/ui/TableGrid/TableGrid';
import styles from './SessionEvents.module.scss';

interface Row {
  dataTime: string
}

const SessionEvents: FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const sessionId = params.get('id');
  const { sortModel, paginationModel } = useTableGrid((state) => state);
  const { filterDate } = useFilterDateRange((state) => state);
  const { dateRange } = filterDate;
  const [localFilterModel, setLocalFilterModel] = useState<GridFilterModel>({ items: [], quickFilterValues: [] });
  const hasMounted = useRef(false);

  const {
    data,
    isLoading,
    error,
  } = useDataRequest<SessionEvent[]>(
    'session',
    () => postSessionsData({
      sessionId,
      paginationModel,
      sortModel,
      filterModel: localFilterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
    }),
  );

  const { mutate, isLoading: isLoadingMutate } = useMutationRequest<SessionEvent[]>(
    'session',
    () => postSessionsData({
      sessionId,
      paginationModel,
      sortModel,
      filterModel: localFilterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
    }),
  );

  useEffect(() => {
    if (hasMounted.current) {
      mutate();
    } else {
      hasMounted.current = true;
    }
  }, [mutate, paginationModel, localFilterModel, filterDate, dateRange]);

  const columns: GridColDef[] = useMemo(() => {
    const baseColumns: GridColDef[] = [
      {
        field: 'betId',
        headerName: 'Bet ID',
        flex: 1,
        cellClassName: (params) => (params.row.Refound ? styles.highlightCell : ''),

      },
      { field: 'actionType', headerName: 'Action Type', flex: 1 },
      {
        field: 'dataTime',
        headerName: 'Date Time',
        type: 'date',
        flex: 2,
        valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD HH:mm:ss'),
      },
      { field: 'totalAmountBetUSD', headerName: 'Bet', flex: 1 },
      {
        field: 'totalAmountWinUSD',
        headerName: 'Amount Win',
        flex: 1,
        // cellClassName: (params) => (params.row.Refound ? styles.highlightCell : ''),
      },
      { field: 'serverSeed', headerName: 'Server Seed', flex: 1 },
      { field: 'clientSeed', headerName: 'Client Seed', flex: 1 },
      {
        field: 'BetCoefficientes',
        headerName: 'Bet Coefficients',
        flex: 2,
        renderCell: (params) => {
          const betCoefs = Array.isArray(params.value) ? params.value : [];
          return (
            <Tooltip title={JSON.stringify(betCoefs, null, 2)}>
              <Typography variant="body2" noWrap>
                {betCoefs.length > 0
                  ? betCoefs.map((coef) => `${coef.value} (${coef.coefficient})`).join(', ')
                  : '—'}
              </Typography>
            </Tooltip>
          );
        },
      },
      {
        field: 'result',
        headerName: 'Game Result',
        flex: 2,
        renderCell: (params) => {
          const { value } = params;

          if (typeof value === 'string') {
            return <Typography variant="body2">{value}</Typography>;
          }

          if (Array.isArray(value)) {
            const resultMap: Record<string, string> = {
              mine: 'мина',
              diamond: 'брильянт',
            };

            return (
              <Tooltip title={JSON.stringify(value, null, 2)}>
                <Box>
                  {value.map((item: any, index: number) => (
                    <Typography variant="body2" key={index} noWrap>
                      {item.pick}
                      :
                      {resultMap[item.result] || item.result}
                    </Typography>
                  ))}
                </Box>
              </Tooltip>
            );
          }

          return <Typography variant="body2">—</Typography>;
        },
      },

    ];

    return baseColumns;
  }, [data]);

  const rowId = (row: Row) => row.dataTime;

  return (
    <div>
      <TableGrid
        data={data}
        rowCountState={data?.length || 0}
        rowId={rowId}
        isLoading={isLoading || isLoadingMutate}
        error={error as Error}
        columns={columns}
        title="Session Table"
        sortModel={sortModel}
        setLocalFilterModel={setLocalFilterModel}
        sortingMode="server"
      />
    </div>
  );
};

export default SessionEvents;
