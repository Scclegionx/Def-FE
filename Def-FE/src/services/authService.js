import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

const authService = {
  async login(username, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password
      });
      
      if (response.data.status === 'success') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Đăng nhập thất bại' };
    }
  },

  async logout() {
    try {
      await axios.post(`${API_URL}/logout`);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
    } catch (error) {
      throw error.response?.data || { message: 'Đăng xuất thất bại' };
    }
  },

  isAuthenticated() {
    return localStorage.getItem('isLoggedIn') === 'true';
  },

  getUsername() {
    return localStorage.getItem('username');
  }
};

export default authService; 