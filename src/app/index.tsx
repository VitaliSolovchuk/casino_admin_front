import React, { FC } from 'react';
import {
  BrowserRouter as Router, Routes, Route, Link,
} from 'react-router-dom';
import './index.scss';
import Authmiddleware from './routes/route';
import { authProtectedRoutes } from './routes';

const Index: FC = () => (
  <Router>
    <div className="root-container">
      <div className="sidebar">
        <ul>
          <li>
            <Link to="/partners">Partners</Link>
          </li>
          {/* Добавьте другие маршруты по мере необходимости */}
        </ul>
      </div>
      <div className="main-content">
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
                  {route.element}
                </Authmiddleware>
                )}
              key={idx}
            />
          ))}
        </Routes>
      </div>
    </div>
  </Router>
);

export default Index;
