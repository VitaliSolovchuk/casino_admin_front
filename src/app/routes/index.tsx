import React, { ReactElement } from 'react';
import { Navigate, RouteProps } from 'react-router-dom';
import Partners from 'pages/Partners/Partners';
import Players from 'pages/Players/Players';
import SessionEvents from 'pages/SessionEvents/SessionEvents';
import Dashboard from 'pages/Dashboard/Dashboard';

type AppRoute = RouteProps & {
  path: string;
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
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/partners',
    element: <Partners />,
  },
  {
    path: '/partners/:partnerId',
    element: <Players />,
  },
  {
    path: '/partners/:partnerId/players/:playerId/sessions/:sessionId',
    element: <SessionEvents />,
  },
];
