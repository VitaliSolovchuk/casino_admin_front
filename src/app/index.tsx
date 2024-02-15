import React, { FC } from 'react';
import {
  BrowserRouter as Router, Routes, Route,
} from 'react-router-dom';
import './index.scss';
import Authmiddleware from './routes/route';
import { authProtectedRoutes } from './routes';
import Layout from './layout/authLayout';
import 'bootstrap/dist/css/bootstrap.min.css';

const Index: FC = () => (
  <Router>
    <div className="root-container">
      <Routes>
        {/* /!* Отображение маршрутов для неавторизованных пользователей *!/ */}
        {/* {publicRoutes.map((route, idx) => ( */}
        {/*  <Route */}
        {/*    path={route.path} */}
        {/*    element={<NonAuthLayout>{route.component}</NonAuthLayout>} */}
        {/*    key={idx} */}
        {/*    exact={true} */}
        {/*  /> */}
        {/* ))} */}

        {/* Отображение маршрутов для авторизованных пользователей */}
        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={(
              <Authmiddleware>
                <Layout>{route.element}</Layout>
              </Authmiddleware>
            )}
            key={idx}
          />
        ))}
      </Routes>
    </div>
  </Router>
);

export default Index;
