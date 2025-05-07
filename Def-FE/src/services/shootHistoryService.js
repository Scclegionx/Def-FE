import axios from 'axios';

const API_URL = 'http://localhost:5000';

const shootHistoryService = {
  async getShootHistory(page = 1, size = 10) {
    try {
      const response = await axios.get(`${API_URL}/shoot_history`, {
        params: {
          page,
          size
        }
      });
      
      if (response.data.status === 'success') {
        console.log(response.data);
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi khi lấy lịch sử bắn' };
    }
  },

  async getTotalShootHistory() {
    try {
      const response = await axios.get(`${API_URL}/shoot-history/total`);
      
      if (response.data.status === 'success') {
        return response.data.total;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi khi lấy tổng số bản ghi' };
    }
  },

  async getRemainingBullets() {
    try {
      const response = await axios.get(`${API_URL}/bullet/first`);
      
      if (response.data.status === 'success') {
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi khi lấy số đạn còn lại' };
    }
  },

  async saveShootHistory(username, status) {
    try {
      const response = await fetch(`${API_URL}/save-shoot-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          status
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi lưu lịch sử bắn:', error);
      throw error;
    }
  },

  async reload() {
    try {
      const response = await fetch(`${API_URL}/reload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi nạp đạn:', error);
      throw error;
    }
  }
};

export default shootHistoryService; 