import React, { FC, useState } from 'react';
import avatar from 'shared/assets/images/users/avatar-6.jpg';
import './Header.scss';
import Breadcrumbs from 'entities/breadCrumbs/ui/BreadCrumbs';
import { useMediaQuery } from 'react-responsive';

const Header: FC = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [username, setUsername] = useState('Admin');

  return (
    !isMobile ? (
      <div className="header">
        <div className="navbar_header">
          <Breadcrumbs />
          <div>
            <img
              className="rounded-circle header-profile-user"
              src={avatar}
              alt="Header Avatar"
            />
            <span className="d-none d-xl-inline-block ms-2 me-1">{username}</span>
            <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
          </div>
        </div>
      </div>
    ) : null
  );
};

export default Header;
