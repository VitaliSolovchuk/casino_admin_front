import { useCallback, useEffect, useRef } from 'react';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';
import { postPartnersData } from 'features/partners/api';
import { PartnerData } from 'features/partners/types/types';
import { paths } from 'shared/lib/consts/paths';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import useGgr from 'entities/appBars/model/appBarStore';

const usePartnersDataHook = () => {
  const isFirstRender = useRef(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    filterModel,
    sortModel,
    paginationModel,
  } = useTableGrid((state) => state);

  const { filterDate } = useFilterDateRange((state) => state);

  const { setGgr } = useGgr((state) => state);

  const fetchData = useCallback(() => postPartnersData({
    paginationModel,
    sortModel,
    filterModel,
    filterDate: {
      startDate: filterDate.dateRange[0],
      endDate: filterDate.dateRange[1],
    },
  }), [paginationModel, sortModel, filterModel, filterDate]);

  const {
    data,
    isLoading,
    error,
  } = useDataRequest<PartnerData>('partners', fetchData);

  const {
    mutate,
  } = useMutationRequest<PartnerData>('partners', fetchData);

  useEffect(() => {
    setGgr(data?.totalGGR || 0);
  }, [data?.totalGGR, setGgr]);

  useEffect(() => {
    if (!isFirstRender.current) {
      mutate();
    } else {
      isFirstRender.current = false;
    }
  }, [mutate, paginationModel, sortModel, filterModel, filterDate]);

  const handleRowClick = useCallback((row: Record<string, number>) => {
    if (row.partnerId) {
      queryClient.invalidateQueries({ queryKey: 'players' })
        .then(() => navigate(`${paths.players}/?id=${row.partnerId}&currency=${row.currencyName}`));
    }
  }, [queryClient, navigate]);

  return {
    data: data?.partnerCurrencyStatistic,
    isLoading,
    error,
    handleRowClick,
  };
};

export default usePartnersDataHook;
