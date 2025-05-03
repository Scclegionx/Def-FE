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
  }
};

export default radarHistoryService; 