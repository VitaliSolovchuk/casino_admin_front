import React, { ReactElement } from 'react';
import { Navigate, RouteProps } from 'react-router-dom';
import Partners from 'pages/Partners/Partners';
import Players from 'pages/Players/Players';
import SessionEvents from 'pages/SessionEvents/SessionEvents';
import Dashboard from 'pages/Dashboard/Dashboard';
import { paths } from 'shared/lib/consts/paths';
import { names } from 'shared/lib/consts/names';

export type AppRoute = RouteProps & {
  path: string;
  name: string;
  element: ReactElement;
};

// Определение маршрутов для неавторизованных пользователей
export const publicRoutes: AppRoute[] = [
  // Список маршрутов для неавторизованных пользователей
];

// Определение маршрутов для авторизованных пользователей
export const authProtectedRoutes: AppRoute[] = [
  {
    path: paths.home,
    name: names.Home,
    element: <Navigate to={paths.dashboard} replace />,
  },
  {
    path: paths.dashboard,
    name: names.Dashboard,
    element: <Dashboard />,
  },
  {
    path: paths.partners,
    name: names.Partners,
    element: <Partners />,
  },
  {
    path: paths.players,
    name: names.Players,
    element: <Players />,
  },
  {
    path: paths.sessionEvents,
    name: names.SessionEvents,
    element: <SessionEvents />,
  },
];
