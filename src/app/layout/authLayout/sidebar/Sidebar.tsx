import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => (
  <div className="sidebar">
    <ul>
      <li>
        <NavLink to="/partners">Partners</NavLink>
      </li>
      {/* Добавьте другие маршруты по мере необходимости */}
    </ul>
  </div>
);

export default Sidebar;
