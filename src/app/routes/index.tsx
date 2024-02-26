import React, { ReactElement } from 'react';
import { Navigate, RouteProps } from 'react-router-dom';
import Partners from 'pages/Partners/Partners';
import Players from 'pages/Players/Players';
import SessionEvents from 'pages/SessionEvents/SessionEvents';
import Dashboard from 'pages/Dashboard/Dashboard';

type AppRoute = RouteProps & {
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
    path: '/',
    name: 'Home',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    element: <Dashboard />,
  },
  {
    path: '/partners',
    name: 'Partners',
    element: <Partners />,
  },
  {
    path: '/partners/players',
    name: 'Players',
    element: <Players />,
  },
  {
    path: '/partners/players/sessions',
    name: 'SessionEvents',
    element: <SessionEvents />,
  },
];
