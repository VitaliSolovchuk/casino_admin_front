import React, {
  FC, useEffect, useState, useContext,
} from 'react';
import { useMediaQuery } from 'react-responsive';
import AppBarMob from 'entities/appBars/appBarMob/ui/AppBarMob';
import AppBarDesk from 'entities/appBars/appBarDesk/ui/AppBarDesk';
import TotalGGRContext from '../../../../TotalGGRContext';

const Sidebar: FC = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [showAppBar, setShowAppBar] = useState<boolean>(true);

  const { totalGgrUsd } = useContext(TotalGGRContext);

  useEffect(() => {
    const handleScroll = () => {
      setShowAppBar(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {isMobile && showAppBar && <AppBarMob />}
      {!isMobile && <AppBarDesk totalGGR={totalGgrUsd} />}
    </>
  );
};

export default Sidebar;
