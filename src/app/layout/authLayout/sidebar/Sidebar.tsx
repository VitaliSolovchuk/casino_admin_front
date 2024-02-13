import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from 'shared/assets/icons/Logo';
import styles from './Sidebar.module.scss';

const Sidebar = () => (
  <>
    <div className={styles.logo}>
      <Logo />
    </div>
    <div className="sidebar">
      <ul>
        <li>
          <NavLink to="/partners">Partners</NavLink>
        </li>
        {/* Добавьте другие маршруты по мере необходимости */}
      </ul>
    </div>
  </>
);

export default Sidebar;
