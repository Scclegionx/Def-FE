import { useEffect, useState } from 'react';
import { wsService } from '../services/websocket';

const Control = () => {
  const [isKeyPressed, setIsKeyPressed] = useState({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
  });

  useEffect(() => {
    // Connect to WebSocket server
    wsService.connect('ws://localhost:8080');

    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setIsKeyPressed(prev => ({ ...prev, [e.key]: true }));
        wsService.sendCommand(e.key);
      }
    };

    const handleKeyUp = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setIsKeyPressed(prev => ({ ...prev, [e.key]: false }));
        wsService.sendCommand('STOP');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      wsService.disconnect();
    };
  }, []);

  const handleButtonPress = (direction) => {
    setIsKeyPressed(prev => ({ ...prev, [direction]: true }));
    wsService.sendCommand(direction);
  };

  const handleButtonRelease = () => {
    setIsKeyPressed(prev => ({
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false
    }));
    wsService.sendCommand('STOP');
  };

  return (
    <div className="control-container">
      <h1 className="control-title">Control Panel</h1>
      <div className="control-grid">
        <div className="col-start-2">
          <button
            className={`control-button ${isKeyPressed.ArrowUp ? 'active' : ''}`}
            onMouseDown={() => handleButtonPress('ArrowUp')}
            onMouseUp={handleButtonRelease}
            onMouseLeave={handleButtonRelease}
          >
            ↑
          </button>
        </div>
        <div className="col-start-1">
          <button
            className={`control-button ${isKeyPressed.ArrowLeft ? 'active' : ''}`}
            onMouseDown={() => handleButtonPress('ArrowLeft')}
            onMouseUp={handleButtonRelease}
            onMouseLeave={handleButtonRelease}
          >
            ←
          </button>
        </div>
        <div className="col-start-3">
          <button
            className={`control-button ${isKeyPressed.ArrowRight ? 'active' : ''}`}
            onMouseDown={() => handleButtonPress('ArrowRight')}
            onMouseUp={handleButtonRelease}
            onMouseLeave={handleButtonRelease}
          >
            →
          </button>
        </div>
        <div className="col-start-2">
          <button
            className={`control-button ${isKeyPressed.ArrowDown ? 'active' : ''}`}
            onMouseDown={() => handleButtonPress('ArrowDown')}
            onMouseUp={handleButtonRelease}
            onMouseLeave={handleButtonRelease}
          >
            ↓
          </button>
        </div>
      </div>
      <div className="control-instructions">
        <p>Use arrow keys or click buttons to control the gun tower</p>
        <p>Hold to continue movement, release to stop</p>
      </div>
    </div>
  );
};

export default Control; 