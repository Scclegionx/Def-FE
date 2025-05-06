import { useEffect, useState } from 'react';
import { wsService } from '../services/websocket';
import { useNavigate } from 'react-router-dom';
import voiceCommandService from '../services/voiceCommandService';
import shootHistoryService from '../services/shootHistoryService';

const Control = () => {
  const [isKeyPressed, setIsKeyPressed] = useState({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [voiceCommand, setVoiceCommand] = useState('');
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(localStorage.getItem('isLoaded') === 'true');
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoaded(localStorage.getItem('isLoaded') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Kiểm tra đăng nhập
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/login');
      return;
    }

    // Khởi tạo SpeechRecognition
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'vi-VN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Kết quả nhận diện giọng nói:', transcript);
        setVoiceCommand(transcript);
        handleVoiceCommand(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Lỗi nhận diện giọng nói:', event.error);
        setError('Lỗi khi nhận diện giọng nói: ' + event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        console.log('Kết thúc ghi âm');
        setIsRecording(false);
      };

      setRecognition(recognition);
    } else {
      setError('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói');
    }

    // Lắng nghe tin nhắn từ websocket
    const handleWebSocketMessage = (message) => {
      try {
        const data = JSON.parse(message);
        if (data.received === true) {
          // Lưu lịch sử bắn
          const username = localStorage.getItem('username');
          shootHistoryService.saveShootHistory(username, 'success');
          // Cập nhật trạng thái đạn sau khi bắn thành công
          setIsLoaded(false);
          localStorage.setItem('isLoaded', 'false');
        }
      } catch (error) {
        console.error('Lỗi khi xử lý tin nhắn websocket:', error);
      }
    };

    wsService.onMessage(handleWebSocketMessage);

    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        const key = e.key === ' ' ? 'Space' : e.key;
        setIsKeyPressed(prev => ({ ...prev, [key]: true }));
        if (key === 'Space' && isLoaded) {
          handleShoot();
        } else if (key !== 'Space') {
          wsService.sendCommand(key);
        }
      }
    };

    const handleKeyUp = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        const key = e.key === ' ' ? 'Space' : e.key;
        setIsKeyPressed(prev => ({ ...prev, [key]: false }));
        if (key !== 'Space') {
          wsService.sendCommand('STOP');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      wsService.offMessage(handleWebSocketMessage);
    };
  }, [navigate, isLoaded]);

  const handleShoot = async () => {
    try {
      if (!isLoaded) {
        setError('Vui lòng nạp đạn trước khi bắn');
        return;
      }
      // Gửi lệnh bắn qua websocket
      wsService.sendCommand('Space');
      // Đánh dấu đã bắn
      setIsLoaded(false);
      localStorage.setItem('isLoaded', 'false');
    } catch (error) {
      console.error('Lỗi khi bắn:', error);
      setError('Lỗi khi bắn: ' + error.message);
    }
  };

  const handleReload = async () => {
    try {
      // Nạp đạn
      await shootHistoryService.reload();
      setIsLoaded(true);
      localStorage.setItem('isLoaded', 'true');
      setError('');
    } catch (error) {
      console.error('Lỗi khi nạp đạn:', error);
      setError('Lỗi khi nạp đạn: ' + error.message);
    }
  };

  const handleVoiceCommand = async (command) => {
    try {
      console.log('Xử lý lệnh giọng nói:', command);
      
      // Xử lý các lệnh di chuyển
      if (command.includes('lên')) {
        await voiceCommandService.sendVoiceCommand('ArrowUp');
      } else if (command.includes('xuống')) {
        await voiceCommandService.sendVoiceCommand('ArrowDown');
      } else if (command.includes('trái')) {
        await voiceCommandService.sendVoiceCommand('ArrowLeft');
      } else if (command.includes('phải')) {
        await voiceCommandService.sendVoiceCommand('ArrowRight');
      } else if (command.includes('bắn')) {
        await handleShoot();
      } else if (command.includes('dừng')) {
        await voiceCommandService.sendVoiceCommand('STOP');
      }
    } catch (error) {
      console.error('Lỗi khi xử lý lệnh giọng nói:', error);
      setError(error.message);
    }
  };

  const toggleRecording = () => {
    if (recognition) {
      if (!isRecording) {
        console.log('Bắt đầu ghi âm...');
        setError('');
        setVoiceCommand('');
        recognition.start();
        setIsRecording(true);
      } else {
        console.log('Dừng ghi âm...');
        recognition.stop();
      }
    }
  };

  const handleButtonPress = async (direction) => {
    if (direction === 'Space' && !isLoaded) {
      return;
    }
    setIsKeyPressed(prev => ({ ...prev, [direction]: true }));
    if (direction === 'Space') {
      await handleShoot();
    } else {
      wsService.sendCommand(direction);
    }
  };

  const handleButtonRelease = () => {
    setIsKeyPressed(prev => ({
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      Space: false
    }));
    wsService.sendCommand('STOP');
  };

  return (
    <div className="control-container">
      <h1 className="control-title">Control Panel</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="control-grid">
        <div className="control-row">
          <div className="control-col">
            <button
              className={`control-button ${isKeyPressed.ArrowUp ? 'active' : ''}`}
              onMouseDown={() => handleButtonPress('ArrowUp')}
              onMouseUp={handleButtonRelease}
              onMouseLeave={handleButtonRelease}
            >
              ↑
            </button>
          </div>
        </div>
        <div className="control-row">
          <div className="control-col">
            <button
              className={`control-button ${isKeyPressed.ArrowLeft ? 'active' : ''}`}
              onMouseDown={() => handleButtonPress('ArrowLeft')}
              onMouseUp={handleButtonRelease}
              onMouseLeave={handleButtonRelease}
            >
              ←
            </button>
          </div>
          <div className="control-col">
            <button
              className={`control-button ${isKeyPressed.ArrowDown ? 'active' : ''}`}
              onMouseDown={() => handleButtonPress('ArrowDown')}
              onMouseUp={handleButtonRelease}
              onMouseLeave={handleButtonRelease}
            >
              ↓
            </button>
          </div>
          <div className="control-col">
            <button
              className={`control-button ${isKeyPressed.ArrowRight ? 'active' : ''}`}
              onMouseDown={() => handleButtonPress('ArrowRight')}
              onMouseUp={handleButtonRelease}
              onMouseLeave={handleButtonRelease}
            >
              →
            </button>
          </div>
        </div>
        <div className="control-row">
          <div className="control-col">
            <button
              className={`control-button fire-button ${isKeyPressed.Space ? 'active' : ''} ${!isLoaded ? 'disabled' : ''}`}
              onMouseDown={() => isLoaded && handleButtonPress('Space')}
              onMouseUp={handleButtonRelease}
              onMouseLeave={handleButtonRelease}
              disabled={!isLoaded}
              style={{ pointerEvents: isLoaded ? 'auto' : 'none' }}
            >
              FIRE
            </button>
          </div>
          <div className="control-col">
            <button
              className="control-button reload-button"
              onClick={handleReload}
            >
              NẠP ĐẠN
            </button>
          </div>
        </div>
      </div>

      <div className="voice-control">
        <button 
          className={`voice-button ${isRecording ? 'recording' : ''}`}
          onClick={toggleRecording}
        >
          {isRecording ? 'Đang ghi âm...' : 'Nhấn để nói'}
        </button>
        
        {voiceCommand && (
          <div className="voice-command-result">
            <p>Lệnh đã nhận: {voiceCommand}</p>
          </div>
        )}
      </div>

      <div className="control-instructions">
        <p>Use arrow keys or click buttons to control the gun tower</p>
        <p>Press SPACE or click FIRE button to shoot</p>
        <p>Hold to continue movement, release to stop</p>
        <p>Or use voice command by clicking the microphone button</p>
        <p>Các lệnh giọng nói: "lên", "xuống", "trái", "phải", "bắn", "dừng"</p>
      </div>
    </div>
  );
};

export default Control; 