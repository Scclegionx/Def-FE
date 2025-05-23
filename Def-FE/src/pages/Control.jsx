import { useEffect, useState } from 'react';
import { wsService } from '../services/websocket';
import { useNavigate } from 'react-router-dom';

const Control = () => {
  const [isKeyPressed, setIsKeyPressed] = useState({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra đăng nhập
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/login');
      return;
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
      <div className="control-instructions">
        <p>Use arrow keys or click buttons to control the gun tower</p>
        <p>Press SPACE or click FIRE button to shoot</p>
        <p>Hold to continue movement, release to stop</p>
      </div>
    </div>
  );
};

export default Control; 