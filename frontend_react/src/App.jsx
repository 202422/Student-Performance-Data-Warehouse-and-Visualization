import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';
import './charts/ChartjsConfig';

// Pages
import Dashboard from './pages/Dashboard';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardProf from './pages/DashboardProf';
import Login from './pages/Login';



function App() {

  const location = useLocation();
  const isAuthPage = location.pathname === "/login";

  useEffect(() => {
    // Scroll to top on route change
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]);

  return (
    <>
      {isAuthPage ? (
        // 👉 Si page Login, pas de layout Mosaic
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        // 👉 Sinon, sidebar + header Mosaic
        
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin-dashboard" element={<DashboardAdmin />} />
            <Route path="/prof-dashboard" element={<DashboardProf />} />
    
          </Routes>
        
      )}
    </>
  );
}

export default App;
