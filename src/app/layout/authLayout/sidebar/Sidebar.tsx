import React, { FC, useEffect, useState } from 'react';

import { useMediaQuery } from 'react-responsive';
import AppBarMob from 'entities/appBars/appBarMob/ui/AppBarMob';
import AppBarDesk from 'entities/appBars/appBarDesk/ui/AppBarDesk';
import useGgr from 'entities/appBars/model/appBarStore';

const Sidebar: FC = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [showAppBar, setShowAppBar] = useState<boolean>(true);
  const { ggr } = useGgr((state) => state);

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
      {!isMobile && <AppBarDesk totalGGR={ggr || 0} />}
    </>
  );
};

export default Sidebar;
