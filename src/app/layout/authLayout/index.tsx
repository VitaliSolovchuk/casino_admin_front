import React, { FC, ReactNode } from 'react';
import Container from '@mui/material/Container';
import { useMediaQuery } from 'react-responsive';
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';
import Footer from './footer/Footer';

interface LayoutProps {
  children: ReactNode;
}
const Layout: FC<LayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <>
      <Header />
      <Sidebar />
      {/* <div className="main-content"> */}
      {/*   <div className="page-content">{children}</div> */}
      {/* </div> */}
      <Container
        maxWidth={false}
        sx={{
          flex: 1,
          ml: isMobile ? 0 : '250px',
          pt: isMobile ? '60px' : '90px',
          maxWidth: isMobile ? '100vw' : 'calc(100vw - 250px)',
          overflow: 'hidden',
        }}
      >
        {children}
      </Container>
      <Footer />
    </>
  );
};

export default Layout;
