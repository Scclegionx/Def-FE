import { useEffect, useState } from 'react';
import { wsService } from '../services/websocket';
import { useNavigate } from 'react-router-dom';
import voiceCommandService from '../services/voiceCommandService';

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
  const navigate = useNavigate();

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
        const transcript = event.results[0][0].transcript;
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

    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        const key = e.key === ' ' ? 'Space' : e.key;
        setIsKeyPressed(prev => ({ ...prev, [key]: true }));
        wsService.sendCommand(key);
      }
    };

    const handleKeyUp = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        const key = e.key === ' ' ? 'Space' : e.key;
        setIsKeyPressed(prev => ({ ...prev, [key]: false }));
        wsService.sendCommand('STOP');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [navigate]);

  const handleVoiceCommand = async (command) => {
    try {
      console.log('Xử lý lệnh giọng nói:', command);
      if (command.toLowerCase().includes('bắn')) {
        console.log('Phát hiện lệnh bắn, gửi lệnh đến backend...');
        await voiceCommandService.sendVoiceCommand(command);
        wsService.sendCommand('Space');
        console.log('Đã gửi lệnh bắn thành công');
      } else {
        console.log('Không phát hiện lệnh bắn trong câu nói');
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

  const handleButtonPress = (direction) => {
    setIsKeyPressed(prev => ({ ...prev, [direction]: true }));
    wsService.sendCommand(direction);
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
              className={`control-button fire-button ${isKeyPressed.Space ? 'active' : ''}`}
              onMouseDown={() => handleButtonPress('Space')}
              onMouseUp={handleButtonRelease}
              onMouseLeave={handleButtonRelease}
            >
              FIRE
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
      </div>
    </div>
  );
};

export default Control; 