import React, { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.scss';
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material/styles';
import Authmiddleware from './routes/route';
import { AppRoute, authProtectedRoutes } from './routes';
import Layout from './layout/authLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
// const renderPublicRoutes = (routes: AppRoute[]) => routes.map((route) => (
//   <Route
//     path={route.path}
//     element={<NonAuthLayout>{route.component}</NonAuthLayout>}
//     key={route.path}
//     exact
//   />
// ));
const renderProtectedRoutes = (routes: AppRoute[]) => routes.map((route) => (
  <Route
    path={route.path}
    element={(
      <Authmiddleware>
        <Layout>{route.element}</Layout>
      </Authmiddleware>
    )}
    key={route.path}
  />
));

const App: FC = () => {
  console.log(process.env);
  let theme = createTheme();
  theme = responsiveFontSizes(theme);
  return (
    <Router>
      <div className="root-container">
        <ThemeProvider theme={theme}>
          <Routes>
            {/* Отображение маршрутов для неавторизованных пользователей */}
            {/* {renderPublicRoutes(publicRoutes)} */}
            {/* Отображение маршрутов для авторизованных пользователей */}
            {renderProtectedRoutes(authProtectedRoutes)}
          </Routes>
        </ThemeProvider>
      </div>
    </Router>
  );
};

export default App;
