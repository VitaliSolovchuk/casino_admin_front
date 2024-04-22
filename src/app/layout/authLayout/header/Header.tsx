import React, { FC, useState } from 'react';
import avatar from 'shared/assets/images/users/avatar-6.jpg';
import './Header.scss';
import Breadcrumbs from 'entities/breadCrumbs/ui/BreadCrumbs';
import { useMediaQuery } from 'react-responsive';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { paths } from 'shared/lib/consts/paths';

const Header: FC = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [username, setUsername] = useState('Admin');
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    navigate(paths.login);
  };

  const settings = [
    { name: 'Profile', fn: handleCloseUserMenu },
    { name: 'Settings', fn: handleCloseUserMenu },
    { name: 'Logout', fn: handleLogout },
  ];

  return (
    !isMobile ? (
      <div className="header">
        <div className="navbar_header">
          <Breadcrumbs />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography>{username}</Typography>
            <Tooltip title="Open Menu">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
              >
                <Avatar alt="Remy Sharp" src={avatar} />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.name}
                  onClick={setting.fn}
                >
                  <Typography textAlign="center">{setting.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </div>
      </div>
    ) : null
  );
};

export default Header;
