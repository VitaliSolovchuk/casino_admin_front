import React from 'react';
import styles from './Header.module.scss';

const Header = () => {
  console.log('header');
  return (
    <div className="header">
      <div className={styles.navbar_header}>
        <p>Info Header Block</p>
        <p>Profile Block</p>
      </div>
    </div>
  );
};

export default Header;
