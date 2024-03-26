import React, { ReactElement } from 'react';
import { Navigate, RouteProps } from 'react-router-dom';
import Partners from 'pages/Partners/Partners';
import Players from 'pages/Players/Players';
import SessionEvents from 'pages/SessionEvents/SessionEvents';
import Dashboard from 'pages/Dashboard/Dashboard';
import Partners2 from 'pages/Partners/Partners2';
import Players2 from 'pages/Players/Players2';
import SessionEvents2 from 'pages/SessionEvents/SessionEvents2';

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
    path: '/partners2',
    name: 'Partners2',
    element: <Partners2 />,
  },
  {
    path: '/partners/players',
    name: 'Players',
    element: <Players />,
  },
  {
    path: '/partners2/players2',
    name: 'Players2',
    element: <Players2 />,
  },
  {
    path: '/partners/players/sessions',
    name: 'SessionEvents',
    element: <SessionEvents />,
  },
  {
    path: '/partners2/players2/sessions2',
    name: 'SessionEvents2',
    element: <SessionEvents2 />,
  },
];
