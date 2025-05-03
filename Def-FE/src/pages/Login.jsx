import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wsService } from '../services/websocket';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra nếu đã đăng nhập thì chuyển hướng
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      navigate('/control');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Fake login - trong thực tế sẽ gọi API
    if (username && password) {
      // Lưu thông tin đăng nhập và chuyển hướng ngay
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      navigate('/');

      // Sau đó mới thử kết nối WebSocket
      try {
        wsService.connect('ws://localhost:8080');
        
      } catch (error) {
        console.error('Lỗi kết nối:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    wsService.disconnect();
    navigate('/login');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Đăng nhập</h2>
        <div className="form-group">
          <label htmlFor="username">Tên đăng nhập:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login; 