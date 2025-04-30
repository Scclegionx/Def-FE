import { useEffect, useState, useRef } from 'react';
import { wsService } from '../services/websocket';
import '../styles/Radar.css';

const Radar = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [radarData, setRadarData] = useState({ goc: 0, kc: 0 });
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (isConnected) {
        wsService.disconnect();
      }
    };
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      wsService.connect('ws://localhost:8080');
      wsService.onMessage((message) => {
        try {
          const data = JSON.parse(message);
          if (data.radar) {
            setRadarData(data.radar);
          }
        } catch (error) {
          console.error('Lỗi phân tích dữ liệu:', error);
        }
      });
    } else {
      wsService.disconnect();
    }
  }, [isConnected]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height;
    const radius = height;

    const drawRadar = () => {
      // Xóa canvas
      ctx.clearRect(0, 0, width, height);

      // Vẽ nền radar
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, Math.PI, 0);
      ctx.fill();

      // Vẽ các vòng tròn đồng tâm
      for (let i = 1; i <= 5; i++) {
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius * i) / 5, Math.PI, 0);
        ctx.stroke();
      }

      // Vẽ các đường kẻ góc
      for (let i = 0; i <= 180; i += 30) {
        const angle = (i * Math.PI) / 180;
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * radius,
          centerY - Math.sin(angle) * radius
        );
        ctx.stroke();
      }

      // Vẽ điểm phát hiện
      if (radarData.kc > 0) {
        const angle = (radarData.goc * Math.PI) / 180;
        const distance = (radarData.kc * radius) / 100; // Giả sử khoảng cách tối đa là 100
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY - Math.sin(angle) * distance;

        // Vẽ điểm
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Vẽ đường kẻ từ tâm đến điểm
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(drawRadar);
    };

    drawRadar();
  }, [radarData]);

  const toggleConnection = () => {
    setIsConnected(!isConnected);
  };

  return (
    <div className="radar-container">
      <h1 className="radar-title">Radar System</h1>
      <div className="radar-control">
        <button
          className={`radar-button ${isConnected ? 'connected' : 'disconnected'}`}
          onClick={toggleConnection}
        >
          {isConnected ? 'Tắt Radar' : 'Bật Radar'}
        </button>
      </div>
      <div className="radar-display">
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="radar-canvas"
        />
      </div>
      <div className="radar-info">
        <p>Góc: {radarData.goc}°</p>
        <p>Khoảng cách: {radarData.kc}cm</p>
      </div>
    </div>
  );
};

export default Radar; 