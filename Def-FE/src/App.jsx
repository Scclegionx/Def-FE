import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Control from './pages/Control';
import ShootingHistory from './pages/statistics/ShootingHistory';
import AmmoStatus from './pages/statistics/AmmoStatus';
import RadarHistory from './pages/statistics/RadarHistory';
import Radar from './pages/Radar';
import Login from './pages/Login';
import Sidebar from './components/layout/Sidebar';
import './styles/main.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <div className="page-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/control"
                element={
                  <ProtectedRoute>
                    <Control />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/radar"
                element={
                  <ProtectedRoute>
                    <Radar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/statistics/shooting-history"
                element={
                  <ProtectedRoute>
                    <ShootingHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/statistics/ammo-status"
                element={
                  <ProtectedRoute>
                    <AmmoStatus />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/statistics/radar-history"
                element={
                  <ProtectedRoute>
                    <RadarHistory />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
