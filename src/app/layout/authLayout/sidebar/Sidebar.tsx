import React, { FC, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from 'shared/assets/icons/Logo';
import { Typography } from '@mui/material';
import { PartnerData } from 'features/partners/types/types';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { postPartnersData } from 'features/partners/api';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { useMediaQuery } from 'react-responsive';
import AppBar from 'entities/appBar/ui/AppBar';
import styles from './Sidebar.module.scss';

const Sidebar: FC = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [showAppBar, setShowAppBar] = useState<boolean>(true);

  const { filterModel, sortModel, paginationModel } = useTableGrid((state) => state);
  const { filterDate } = useFilterDateRange((state) => state);
  const { dateRange } = filterDate;

  const { data } = useDataRequest<PartnerData>('partners', () => postPartnersData({
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
      {isMobile && showAppBar && (
        <AppBar />
      )}
      {!isMobile && (
        <>
          <div className={styles.logo}>
            <Logo />
          </div>
          <div className="sidebar">
            <ul>
              <li><NavLink to="/dashboard">Dashboard</NavLink></li>
              <li><NavLink to="/partners">Partners</NavLink></li>
              <li><NavLink to="/partners2">Partners 2</NavLink></li>
              {/* Добавьте другие маршруты по мере необходимости */}
            </ul>
            {data?.totalGGR && (
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 2,
                  color: 'white',
                  paddingY: '0.625rem',
                  paddingX: '1.25rem',
                  transition: 'all 0.4s ease',
                }}
              >
                {`Total GGR: $${data.totalGGR}`}
              </Typography>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
