import React, { FC } from 'react';
import styles from 'app/layout/authLayout/sidebar/Sidebar.module.scss';
import Logo from 'shared/assets/icons/Logo';
import { NavLink } from 'react-router-dom';
import { Typography } from '@mui/material';
import { names } from 'shared/lib/consts/names';
import { paths } from 'shared/lib/consts/paths';

interface Props {
  totalGGR?: number;
}
const AppBarDesk: FC<Props> = ({ totalGGR }) => (
  <>
    <div className={styles.logo}>
      <Logo />
    </div>
    <div className="sidebar">
      <ul>
        <li><NavLink to={paths.dashboard}>{names.Dashboard}</NavLink></li>
        <li><NavLink to={paths.partners}>{names.Partners}</NavLink></li>
        {/* Добавьте другие маршруты по мере необходимости */}
      </ul>
      {totalGGR && (
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
        {`Total GGR: $${totalGGR}`}
      </Typography>
      )}
    </div>
  </>
);

export default AppBarDesk;
