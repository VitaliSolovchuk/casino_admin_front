/* eslint-disable react/jsx-no-useless-fragment */
import React, { ReactNode } from 'react';

interface AuthmiddlewareProps {
  children: ReactNode;
}

const Authmiddleware: React.FC<AuthmiddlewareProps> = ({ children }) => (
  // if (!localStorage.getItem('authUser')) {
  //   return (
  //     <Navigate to="/login" />
  //   );
  // }
  // eslint-disable-next-line implicit-arrow-linebreak
  <>{children}</>
);
export default Authmiddleware;
