import React, { FC } from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { authProtectedRoutes } from 'app/routes';

const getBreadcrumbName = (path: string) => {
  const route = authProtectedRoutes.find((route) => route.path === path);
  return route ? route.name : null;
};

const parseQueryParams = (search: string) => new URLSearchParams(search);

const Breadcrumbs: FC = () => {
  const { pathname, search } = useLocation();
  const pathnames = pathname.split('/').filter((x) => x);
  const queryParams = parseQueryParams(search);

  return (
    <MuiBreadcrumbs aria-label="breadcrumb">
      {pathnames.map((path, index) => {
        const url = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const breadcrumbName = getBreadcrumbName(url);

        // Include query parameters in the last breadcrumb
        const params = isLast ? Array.from(queryParams.entries()).map(([key, value]) => `${key}:${value}`).join(', ') : '';

        // eslint-disable-next-line no-nested-ternary
        return breadcrumbName ? (
          !isLast ? (
            <Link underline="hover" color="inherit" key={url} component={RouterLink} to={url}>
              {breadcrumbName}
            </Link>
          ) : (
            <Typography key={url} color="text.primary">
              {params ? `${breadcrumbName} (${params})` : breadcrumbName}
            </Typography>
          )
        ) : (
          <Typography key={url} color="text.primary">
            {path}
          </Typography>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
