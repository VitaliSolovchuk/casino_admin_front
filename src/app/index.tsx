import React, { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.scss';
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
const Index: FC = () => (
  <Router>
    <div className="root-container">
      <Routes>
        {/* Отображение маршрутов для неавторизованных пользователей */}
        {/* {renderPublicRoutes(publicRoutes)} */}
        {/* Отображение маршрутов для авторизованных пользователей */}
        {renderProtectedRoutes(authProtectedRoutes)}
      </Routes>
    </div>
  </Router>
);

export default Index;
