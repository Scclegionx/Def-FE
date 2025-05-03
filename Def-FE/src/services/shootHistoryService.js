import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

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
  }
};

export default shootHistoryService; 