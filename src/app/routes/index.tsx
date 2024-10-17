import { ReactElement } from 'react';
import { Navigate, RouteProps } from 'react-router-dom';
import Partners from 'pages/Partners/Partners';
import SessionEvents from 'pages/SessionEvents/SessionEvents';
import Dashboard from 'pages/Dashboard/Dashboard';
import { paths } from 'shared/lib/consts/paths';
import { names } from 'shared/lib/consts/names';
import Games from 'pages/Games/Games';
import CurrencyGames from 'pages/CurrencyGames/CurrencyGames';
import PartnerCurrency from 'pages/PartnerCurrenсy/PartnerCurrency';
import Sessions2 from 'pages/Sessions2/Sessions2';
import SearchPlayer2 from 'pages/SearchPlayer2/SearchPlayer2';
import Auth from '../../widgets/auth/ui/Auth';

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
    path: paths.sessions,
    name: names.Sessions,
    element: <Sessions2 />,
  },
  {
    path: paths.searchplayer_2,
    name: names.SearchPlayer_2,
    element: <SearchPlayer2 />,
  },
  {
    path: paths.sessionEvents,
    name: names.SessionEvents,
    element: <SessionEvents />,
  },
];
