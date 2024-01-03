import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import PartnersTable from './Components/PartnersTable';
import Players from './Components/Players';
import SessionEvents from './Components/SessionEvents';

const App = () => {
  const [partnersData, setPartnersData] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://dev.jetgames.io/admin-panel/partners');
        setPartnersData(response.data);
      } catch (error) {
        console.error('Error fetching partners data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '200px', padding: '20px', backgroundColor: '#f0f0f0' }}>
          <ul>
            <li>
              <Link to="/partners">Partners</Link>
            </li>
            {/* Добавьте другие маршруты по мере необходимости */}
          </ul>
        </div>
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/partners" element={<PartnersTable partnersData={partnersData} />} />
            <Route path="/partners/:partnerId" element={<Players />} />
            <Route path="/partners/:partnerId/players/:playerId/sessions/:sessionId" element={<SessionEvents />} />
            {/* Добавьте другие Route-компоненты по мере необходимости */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
