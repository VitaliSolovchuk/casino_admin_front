import React, { ReactElement } from 'react';
import { Navigate, RouteProps } from 'react-router-dom';
import Partners from 'pages/Partners/Partners';
import SessionEvents from 'pages/SessionEvents/SessionEvents';
import Dashboard from 'pages/Dashboard/Dashboard';
import { paths } from 'shared/lib/consts/paths';
import { names } from 'shared/lib/consts/names';
import Games from 'pages/Games/Games';
import CurrencyGames from 'pages/CurrencyGames/CurrencyGames';
import Players from 'pages/Sessions/Players';
import SearchPlayer from 'pages/SearchPlayerUserSessions/SearchPlayer';
import Auth from '../../widgets/auth/ui/Auth';
import SessionsForGameCurrency from '../../pages/SessionsForGameCurrency/SessionsForGameCurrency';
import PartnerCurrency from '../../pages/PartnerCurrenсy/PartnerCurrency';

export type AppRoute = RouteProps & {
  path: string;
  name: string;
  element: ReactElement;
};

// Определение маршрутов для неавторизованных пользователей
export const publicRoutes: AppRoute[] = [
  // Список маршрутов для неавторизованных пользователей
  {
    path: paths.login,
    name: names.Login,
    element: <Auth />,
  },
];

// Определение маршрутов для авторизованных пользователей
export const authProtectedRoutes: AppRoute[] = [
  {
    path: paths.home,
    name: names.Home,
    element: <Navigate to={paths.dashboard} replace />,
  },
  {
    path: paths.login,
    name: names.Login,
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
    path: paths.partnerCurrency,
    name: names.PartnerCurrency,
    element: <PartnerCurrency />,
  },
  {
    path: paths.currencygames,
    name: names.СurrencyGames,
    element: <CurrencyGames />,
  },
  {
    path: paths.games,
    name: names.Games,
    element: <Games />,
  },
  {
    path: paths.players,
    name: names.Players,
    element: <Players />,
  },
  {
    path: paths.searchplayer,
    name: names.SearchPlayer,
    element: <SearchPlayer />,
  },
  {
    path: paths.sessionEvents,
    name: names.SessionEvents,
    element: <SessionEvents />,
  },
  {
    path: paths.sessionsForGameCurrency,
    name: names.SessionsForGameCurrency,
    element: <SessionsForGameCurrency />,
  },
];
