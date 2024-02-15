import React from 'react';
import { Col } from 'reactstrap';
import WelcomeComp from '../../entities/welcomeComp/ui/WelcomeComp';
import PageTitle from '../../entities/pageTitle/ui/PageTitle';

const Dashboard = () => (
  <div>
    <PageTitle title="Dashboard" />
    <Col xl="4">
      <WelcomeComp />
    </Col>
  </div>
);

export default Dashboard;
