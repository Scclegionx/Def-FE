import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wsService } from '../services/websocket';
import authService from '../services/authService';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/control');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await authService.login(username, password);
      
      if (response.status === 'success') {
        // Kết nối WebSocket sau khi đăng nhập thành công
        try {
          await wsService.connect('ws://192.168.3.173:8080');
          navigate('/control');
        } catch (error) {
          console.error('Lỗi kết nối WebSocket:', error);
          setError('Lỗi kết nối WebSocket');
        }
      } else {
        setError(response.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      setError(error.message || 'Đăng nhập thất bại');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      wsService.disconnect();
      navigate('/login');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Đăng nhập</h2>
        {error && <div className="error-message">{error}</div>}
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