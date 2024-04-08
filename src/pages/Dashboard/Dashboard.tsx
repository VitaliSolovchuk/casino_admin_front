import React from 'react';
import { Col } from 'reactstrap';
import WelcomeComp from 'entities/welcomeComp/ui/WelcomeComp';
import { Typography } from '@mui/material';

const Dashboard = () => (
  <div>
    <Typography variant="h6" sx={{ mb: 2 }}>Dashboard</Typography>
    <Col xl="4">
      <WelcomeComp />
    </Col>
  </div>
);

export default Dashboard;
