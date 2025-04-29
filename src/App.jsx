import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Control from './pages/Control';
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
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
