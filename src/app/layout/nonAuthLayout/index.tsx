import React, { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode
}
const nonAuthLayout: FC<Props> = ({ children }) => (
  <div>
    {children}
  </div>
);

export default nonAuthLayout;
