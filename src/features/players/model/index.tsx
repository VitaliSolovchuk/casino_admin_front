import { useCallback, useEffect, useRef } from 'react';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';
import { paths } from 'shared/lib/consts/paths';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { postPlayersData } from '../api';
import { Player } from '../types/types';

const usePlayersDataHook = (
  partnerId: string | null,
  currency: string | null,
) => {
  const isFirstRender = useRef(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    filterModel,
    sortModel,
    paginationModel,
  } = useTableGrid((state) => state);
  const { filterDate } = useFilterDateRange((state) => state);

  const fetchData = useCallback(() => postPlayersData({
    partnerId,
    currency,
    paginationModel,
    sortModel,
    filterModel,
    filterDate: {
      startDate: filterDate.dateRange[0],
      endDate: filterDate.dateRange[1],
    },
  }), [partnerId, currency, paginationModel, sortModel, filterModel, filterDate.dateRange]);

  const { data, isLoading, error } = useDataRequest<Player[]>('players', fetchData);

  const { mutate } = useMutationRequest<Player[]>('players', fetchData);

  useEffect(() => {
    if (!isFirstRender.current) {
      mutate();
    } else {
      isFirstRender.current = false;
    }
  }, [mutate, paginationModel, sortModel, filterModel, filterDate]);

  const handleRowClick = useCallback((row: Record<string, number>) => {
    if (row.sessionId) {
      queryClient.invalidateQueries({ queryKey: 'session' })
        .then(() => navigate(`${paths.sessionEvents}/?id=${row.sessionId}`));
    }
  }, [queryClient, navigate]);

  return {
    data,
    isLoading,
    error,
    handleRowClick,
  };
};

export default usePlayersDataHook;
