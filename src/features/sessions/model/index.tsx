import { useCallback, useEffect, useRef } from 'react';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { postSessionsData } from '../api';
import { SessionEvent } from '../types/types';

const useSessionsDataHook = (
  sessionId: string | null,
) => {
  const isFirstRender = useRef(true);
  const {
    filterModel,
    sortModel,
    paginationModel,
  } = useTableGrid((state) => state);
  const { filterDate } = useFilterDateRange((state) => state);

  const fetchData = useCallback(() => postSessionsData({
    sessionId,
    paginationModel,
    sortModel,
    filterModel,
    filterDate: {
      startDate: filterDate.dateRange[0],
      endDate: filterDate.dateRange[1],
    },
  }), [sessionId, paginationModel, sortModel, filterModel, filterDate.dateRange]);

  const { data, isLoading, error } = useDataRequest<SessionEvent[]>('session', fetchData);

  const { mutate } = useMutationRequest<SessionEvent[]>('session', fetchData);

  useEffect(() => {
    if (!isFirstRender.current) {
      mutate();
    } else {
      isFirstRender.current = false;
    }
  }, [mutate, paginationModel, sortModel, filterModel, filterDate]);

  return {
    data,
    isLoading,
    error,
  };
};

export default useSessionsDataHook;
