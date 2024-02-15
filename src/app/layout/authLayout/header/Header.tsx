import React, { useState } from 'react';
import avatar from 'shared/assets/images/users/avatar-6.jpg';
import './Header.scss';

const Header = () => {
  const [username, setusername] = useState('Admin');
  return (
    <div className="header">
      <div className="navbar_header">
        <p>Info Title</p>
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
  );
};

export default Header;
