import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import Index from './app';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
);
