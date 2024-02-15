import React, { FC } from 'react';
import './PageTitle.scss';

interface title {
  title: string
}
const PageTitle: FC<title> = ({ title }) => (
  <div className="page-title-box d-sm-flex align-items-center justify-content-between">
    <h4 className="mb-sm-0 font-size-18">{title}</h4>
  </div>
);

export default PageTitle;
