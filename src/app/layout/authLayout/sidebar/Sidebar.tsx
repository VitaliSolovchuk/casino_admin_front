import React, { FC, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from 'shared/assets/icons/Logo';
import { Typography } from '@mui/material';
import { useQueryClient } from 'react-query';
import { PartnerData } from 'features/partners/types/types';
import styles from './Sidebar.module.scss';
import { useDataRequest } from '../../../../shared/lib/hooks/useDataRequest';
import { fetchPartnersData } from '../../../../features/partners/api';
import useTableGrid from '../../../../widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from '../../../../entities/dateRangeCalendar/model/dateRangeStore';

const Sidebar: FC = () => {
  const {
    filterModel,
    sortModel,
    paginationModel,
  } = useTableGrid((state) => state);

  const {
    filterDate,
  } = useFilterDateRange((state) => state);

  const { dateRange } = filterDate;
  const { data } = useDataRequest<PartnerData>(
    'partners',
    () => fetchPartnersData({
      paginationModel,
      sortModel,
      filterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
    }),
  );
  return (
    <>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className="sidebar">
        <ul>
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/partners">Partners</NavLink>
          </li>
          <li>
            <NavLink to="/partners2">Partners 2</NavLink>
          </li>
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
  );
};

export default Sidebar;
