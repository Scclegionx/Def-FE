import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Control from './pages/Control';
import ShootingHistory from './pages/statistics/ShootingHistory';
import AmmoStatus from './pages/statistics/AmmoStatus';
import RadarHistory from './pages/statistics/RadarHistory';
import Radar from './pages/Radar';
import Sidebar from './components/layout/Sidebar';
import './styles/main.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/control" element={<Control />} />
              <Route path="/radar" element={<Radar />} />
              <Route path="/statistics/shooting-history" element={<ShootingHistory />} />
              <Route path="/statistics/ammo-status" element={<AmmoStatus />} />
              <Route path="/statistics/radar-history" element={<RadarHistory />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
