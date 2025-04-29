import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  const toggleStats = () => {
    setIsStatsOpen(!isStatsOpen);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Gun Tower Control</h1>
      </div>
      <nav>
        <ul>
          <li>
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/control"
              className={`nav-link ${location.pathname === '/control' ? 'active' : ''}`}
            >
              Control Panel
            </Link>
          </li>
          <li>
            <div className="nav-dropdown">
              <button 
                className={`nav-link ${isStatsOpen ? 'active' : ''}`}
                onClick={toggleStats}
              >
                Statistics
                <span className={`dropdown-arrow ${isStatsOpen ? 'open' : ''}`}>▼</span>
              </button>
              {isStatsOpen && (
                <div className="dropdown-content">
                  <Link
                    to="/statistics/shooting-history"
                    className={`nav-link ${location.pathname === '/statistics/shooting-history' ? 'active' : ''}`}
                  >
                    Shooting History
                  </Link>
                  <Link
                    to="/statistics/ammo-status"
                    className={`nav-link ${location.pathname === '/statistics/ammo-status' ? 'active' : ''}`}
                  >
                    Ammo Status
                  </Link>
                  <Link
                    to="/statistics/radar-history"
                    className={`nav-link ${location.pathname === '/statistics/radar-history' ? 'active' : ''}`}
                  >
                    Radar History
                  </Link>
                </div>
              )}
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 