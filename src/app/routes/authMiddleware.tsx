/* eslint-disable react/jsx-no-useless-fragment */
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { paths } from 'shared/lib/consts/paths';

interface AuthmiddlewareProps {
  children: ReactNode;
}

export const AuthMiddleware: React.FC<AuthmiddlewareProps> = ({ children }) => {
  if (!localStorage.getItem('loggedIn')) {
    return (
      <Navigate to={paths.login} replace />
    );
  }
  return <>{children}</>;
};
export const NonAuthMiddleware: React.FC<AuthmiddlewareProps> = ({ children }) => {
  if (localStorage.getItem('loggedIn')) {
    return (
      <Navigate to={paths.dashboard} replace />
    );
  }
  return <>{children}</>;
};
