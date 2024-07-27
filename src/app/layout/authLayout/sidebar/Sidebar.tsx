import React, { FC, useEffect, useState } from 'react';
import { PartnerData } from 'features/partners/types/types';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { postPartnersStatisticData } from 'features/partners/api';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { useMediaQuery } from 'react-responsive';
import AppBarMob from 'entities/appBars/appBarMob/ui/AppBarMob';
import AppBarDesk from 'entities/appBars/appBarDesk/ui/AppBarDesk';

const Sidebar: FC = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [showAppBar, setShowAppBar] = useState<boolean>(true);
  const { filterModel, sortModel, paginationModel } = useTableGrid((state) => state);
  const { filterDate } = useFilterDateRange((state) => state);
  const { dateRange } = filterDate;

  const { data } = useDataRequest<PartnerData>('partners', () => postPartnersStatisticData({
    paginationModel,
    sortModel,
    filterModel,
    filterDate: { startDate: dateRange[0], endDate: dateRange[1] },
  }));

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
      {!isMobile && <AppBarDesk totalGGR={data?.totalGgrUsd} />}
    </>
  );
};

export default Sidebar;
