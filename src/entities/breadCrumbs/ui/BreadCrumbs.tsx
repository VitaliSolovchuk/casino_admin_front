import React, { FC } from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { authProtectedRoutes } from 'app/routes';

const getBreadcrumbName = (path: string) => {
  const route = authProtectedRoutes.find((route) => route.path === path);
  return route ? route.name : null;
};

const Breadcrumbs: FC = () => {
  const { pathname, state } = useLocation();
  const pathnames = pathname.split('/').filter((x) => x);

  return (
    <MuiBreadcrumbs aria-label="breadcrumb">
      {pathnames.map((path, index) => {
        const url = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const breadcrumbName = getBreadcrumbName(url);

        if (breadcrumbName) {
          const queryParam = state && state[breadcrumbName] ? state[breadcrumbName] : '';
          const linkUrl = queryParam ? `${url}/${queryParam}` : url;
          return !isLast ? (
            <Link underline="hover" color="inherit" key={url} component={RouterLink} to={linkUrl}>
              {breadcrumbName}
            </Link>
          ) : (
            <Typography key={url} color="text.primary">
              {breadcrumbName}
            </Typography>
          );
        }

        return (
          <Typography key={url} color="text.primary">
            {path}
          </Typography>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
