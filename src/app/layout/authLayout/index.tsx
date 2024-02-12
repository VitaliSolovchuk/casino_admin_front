import React, { FC, ReactNode } from 'react';
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';
import Footer from './footer/Footer';

interface LayoutProps {
  children: ReactNode;
}
const Layout: FC<LayoutProps> = ({ children }) => (
  <>
    <Header />
    <Sidebar />
    <div className="main-content">
      <div className="page-content">
        {children}
      </div>
    </div>
    <Footer />
  </>
);

export default Layout;
