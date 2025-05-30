import React, { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.scss';
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material/styles';
import { getUserRoleFromToken } from 'utils/getUserRoleFromToken';
import { AuthMiddleware, NonAuthMiddleware } from './routes/authMiddleware';
import {
  adminRoutes, AppRoute, publicRoutes, userRoutes,
} from './routes';
import Layout from './layout/authLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import NonAuthLayout from './layout/nonAuthLayout';
import TotalGGRProvider from '../TotalGGRProvider';

const renderPublicRoutes = (routes: AppRoute[]) => routes.map((route) => (
  <Route
    path={route.path}
    element={(
      <NonAuthMiddleware>
        <NonAuthLayout>{route.element}</NonAuthLayout>
      </NonAuthMiddleware>
    )}
    key={route.path}
  />
));
const renderProtectedRoutes = (routes: AppRoute[]) => routes.map((route) => (
  <Route
    path={route.path}
    element={(
      <AuthMiddleware>
        <Layout>{route.element}</Layout>
      </AuthMiddleware>
    )}
    key={route.path}
  />
));

const App: FC = () => {
  let theme = createTheme(
    {
      palette: {
        primary: {
          main: '#2a3042',
        },
      },
    },
  );
  theme = responsiveFontSizes(theme);
  // const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  const role = getUserRoleFromToken();

  // eslint-disable-next-line operator-linebreak
  const protectedRoutes =
  // eslint-disable-next-line no-nested-ternary
  role === 'ADMIN' ? adminRoutes
    : role === 'USER' ? userRoutes
      : [];
  return (
    <Router>
      <div className="root-container">
        <ThemeProvider theme={theme}>
          <TotalGGRProvider>
            <Routes>
              {/* Отображение маршрутов для неавторизованных пользователей */}
              {renderPublicRoutes(publicRoutes)}
              {/* Отображение маршрутов для авторизованных пользователей */}
              {renderProtectedRoutes(protectedRoutes)}
            </Routes>
          </TotalGGRProvider>
        </ThemeProvider>
      </div>
    </Router>
  );
};

export default App;
