import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const username = localStorage.getItem('username');

  const toggleStats = () => {
    setIsStatsOpen(!isStatsOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Gun Tower Control</h1>
        {isLoggedIn && <p className="welcome-text">Xin chào, {username}</p>}
      </div>
      <nav>
        <ul>
          {isLoggedIn ? (
            <>
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
                <Link
                  to="/radar"
                  className={`nav-link ${location.pathname === '/radar' ? 'active' : ''}`}
                >
                  Radar
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
              <li>
                <button onClick={handleLogout} className="nav-link logout-button">
                  Đăng xuất
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/login"
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                Đăng nhập
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 