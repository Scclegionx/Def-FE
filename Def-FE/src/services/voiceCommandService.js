import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

const voiceCommandService = {
  async sendVoiceCommand(command) {
    try {
      const response = await axios.get(`${API_URL}/voice-command`, {
        params: { command }
      });
      
      if (response.data.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi khi gửi lệnh giọng nói' };
    }
  }
};

export default voiceCommandService; 