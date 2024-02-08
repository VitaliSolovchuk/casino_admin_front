import React, { ReactElement } from 'react';
import { RouteProps } from 'react-router-dom';
import PartnersTable from '../../Components/PartnersTable/PartnersTable';
import Players from '../../Components/Players/Players';
import SessionEvents from '../../Components/SessionEvents/SessionEvents';

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
    path: '/partners',
    element: <PartnersTable />,
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
