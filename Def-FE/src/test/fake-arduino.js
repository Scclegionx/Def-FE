// npm install ws
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log('Fake Arduino WebSocket server đang chạy tại ws://localhost:8080');

// Các hằng số
const MAX_DISTANCE = 200; // Khoảng cách tối đa (cm)
const SCAN_SPEED = 2; // Tốc độ quét (độ/100ms)

// Biến để theo dõi góc quét
let currentAngle = 0;
let isIncreasing = true; // Biến để xác định hướng quét

// Hàm tạo dữ liệu radar giả lập
function generateRadarData() {
  // Cập nhật góc quét
  if (isIncreasing) {
    currentAngle += SCAN_SPEED;
    if (currentAngle >= 180) {
      currentAngle = 180;
      isIncreasing = false;
    }
  } else {
    currentAngle -= SCAN_SPEED;
    if (currentAngle <= 0) {
      currentAngle = 0;
      isIncreasing = true;
    }
  }
  
  return {
    radar: {
      goc: currentAngle,
      kc: Math.random() * MAX_DISTANCE // Sử dụng MAX_DISTANCE
    }
  };
}

wss.on('connection', function connection(ws) {
  console.log('Client đã kết nối');
  let radarInterval = null;
  let isRadarActive = false;

  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);
    console.log('Nhận được lệnh:', data.command);
    
    // Xử lý lệnh từ client
    switch(data.command) {
      case 'open_radar':
        if (!isRadarActive) {
          console.log('Bật radar');
          isRadarActive = true;
          radarInterval = setInterval(() => {
            const radarData = generateRadarData();
            ws.send(JSON.stringify(radarData));
          }, 100);
        }
        break;
      case 'close_radar':
        if (isRadarActive) {
          console.log('Tắt radar');
          isRadarActive = false;
          if (radarInterval) {
            clearInterval(radarInterval);
            radarInterval = null;
          }
        }
        break;
      case 'ArrowUp':
        console.log('Arduino: Di chuyển lên');
        break;
      case 'ArrowDown':
        console.log('Arduino: Di chuyển xuống');
        break;
      case 'ArrowLeft':
        console.log('Arduino: Di chuyển sang trái');
        break;
      case 'ArrowRight':
        console.log('Arduino: Di chuyển sang phải');
        break;
      case 'Space':
        console.log('Arduino: Bắn');
        break;
      case 'STOP':
        console.log('Arduino: Dừng di chuyển');
        break;
      default:
        console.log('Arduino: Lệnh không hợp lệ');
    }
  });

  ws.on('close', () => {
    console.log('Client đã ngắt kết nối');
    if (radarInterval) {
      clearInterval(radarInterval);
      radarInterval = null;
    }
  });
});
