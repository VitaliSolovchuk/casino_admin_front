import React, { FC, useEffect, useState } from 'react';
import { PartnerData, GamesData } from 'features/partners/types/types';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { postPartnersStatisticData, postGamesStatisticData } from 'features/partners/api';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { useMediaQuery } from 'react-responsive';
import AppBarMob from 'entities/appBars/appBarMob/ui/AppBarMob';
import AppBarDesk from 'entities/appBars/appBarDesk/ui/AppBarDesk';
import { useLocation } from 'react-router-dom';

const Sidebar: FC = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [showAppBar, setShowAppBar] = useState<boolean>(true);
  const { filterModel, sortModel, paginationModel } = useTableGrid((state) => state);
  const { filterDate } = useFilterDateRange((state) => state);
  const { dateRange } = filterDate;
  const location = useLocation();
  const isGame = location.pathname === '/games';

  const { data: partnersData } = useDataRequest<PartnerData>('partners', () => postPartnersStatisticData({
    paginationModel,
    filterModel,
    filterDate: { startDate: dateRange[0], endDate: dateRange[1] },
  }));
  const [totalGGR, setTotalGGR] = useState<number | undefined>(partnersData?.totalGgrUsd);
  const { data: gamesData } = useDataRequest<GamesData>('games', () => postGamesStatisticData({
    paginationModel,
    filterModel,
    filterDate: { startDate: dateRange[0], endDate: dateRange[1] },
  }));

  useEffect(() => {
    setTotalGGR(isGame ? gamesData?.totalGgrUsd : partnersData?.totalGgrUsd);
  }, [partnersData, gamesData, location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setShowAppBar(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {isMobile && showAppBar && <AppBarMob />}
      {!isMobile && <AppBarDesk totalGGR={totalGGR} />}
    </>
  );
};

export default Sidebar;
