import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

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
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 