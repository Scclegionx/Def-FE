import { useEffect, useState, useRef } from 'react';
import { wsService } from '../services/websocket';
import { useNavigate } from 'react-router-dom';
import '../styles/Radar.css';

const MAX_DISTANCE = 200; // Khoảng cách tối đa (cm)

const Radar = () => {
  const [isRadarOn, setIsRadarOn] = useState(localStorage.getItem('radarStatus') === 'on');
  const [radarData, setRadarData] = useState({ goc: 0, kc: 0 });
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastPointsRef = useRef([]);
  const navigate = useNavigate();

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Kiểm tra đăng nhập và xử lý dữ liệu radar
  useEffect(() => {
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/login');
      return;
    }

    // Xử lý dữ liệu radar
    wsService.onMessage((message) => {
      try {
        const data = JSON.parse(message);
        if (data.radar) {
          setRadarData(data.radar);
          // Thêm điểm mới vào mảng lastPoints
          lastPointsRef.current.push({
            angle: data.radar.goc,
            distance: data.radar.kc,
            timestamp: Date.now()
          });
          // Giữ lại tối đa 50 điểm gần đây
          if (lastPointsRef.current.length > 50) {
            lastPointsRef.current.shift();
          }
        }
      } catch (error) {
        console.error('Lỗi phân tích dữ liệu:', error);
      }
    });
  }, [navigate]);

  // Vẽ radar
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

      // Vẽ tia quét
      const currentAngle = (radarData.goc * Math.PI) / 180;
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(currentAngle) * radius,
        centerY - Math.sin(currentAngle) * radius
      );
      ctx.stroke();

      // Vẽ các điểm phát hiện
      const now = Date.now();
      lastPointsRef.current.forEach(point => {
        const age = now - point.timestamp;
        if (age < 5000) { // Chỉ hiển thị điểm trong 5 giây
          const angle = (point.angle * Math.PI) / 180;
          const distance = (point.distance * radius) / MAX_DISTANCE;
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY - Math.sin(angle) * distance;

          // Độ trong suốt giảm dần theo thời gian
          const opacity = 1 - (age / 5000);
          
          // Vẽ điểm
          ctx.fillStyle = `rgba(255, 0, 0, ${opacity * 0.8})`;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();

          // Vẽ đường kẻ từ tâm đến điểm
          ctx.strokeStyle = `rgba(255, 0, 0, ${opacity * 0.5})`;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      });

      animationFrameRef.current = requestAnimationFrame(drawRadar);
    };

    drawRadar();
  }, [radarData]);

  const toggleRadar = () => {
    if (isRadarOn) {
      // Tắt radar
      wsService.sendCommand('close_radar');
      setIsRadarOn(false);
      localStorage.setItem('radarStatus', 'off');
    } else {
      // Bật radar
      wsService.sendCommand('open_radar');
      setIsRadarOn(true);
      localStorage.setItem('radarStatus', 'on');
    }
  };

  return (
    <div className="radar-container">
      <h1 className="radar-title">Radar System</h1>
      <div className="radar-control">
        <button
          className={`radar-button ${isRadarOn ? 'connected' : 'disconnected'}`}
          onClick={toggleRadar}
        >
          {isRadarOn ? 'Tắt Radar' : 'Bật Radar'}
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
        <p>Khoảng cách tối đa: {MAX_DISTANCE}cm</p>
      </div>
    </div>
  );
};

export default Radar; 