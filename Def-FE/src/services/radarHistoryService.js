import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

const radarHistoryService = {
  async getDiscoveryHistory(page = 1, size = 10) {
    try {
      const response = await axios.get(`${API_URL}/discovery-history`, {
        params: {
          page,
          size
        }
      });
      
      if (response.data.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi khi lấy lịch sử phát hiện' };
    }
  },

  async getTotalDiscoveryHistory() {
    try {
      const response = await axios.get(`${API_URL}/discovery-history/total`);
      
      if (response.data.status === 'success') {
        return response.data.total;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi khi lấy tổng số bản ghi' };
    }
  },

  saveDiscoveryHistory: async (distance) => {
    try {
      const response = await axios.post(`${API_URL}/save-discovery-history`, {
        method: 'radar',
        distance: distance
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lưu lịch sử phát hiện:', error);
      throw error;
    }
  }
};

export default radarHistoryService; 