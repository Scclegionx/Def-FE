// npm install ws
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log('Fake Arduino WebSocket server đang chạy tại ws://localhost:8080');

wss.on('connection', function connection(ws) {
  console.log('Client đã kết nối');

  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);
    console.log('Nhận được lệnh:', data.command.command);
    
    // Giả lập xử lý lệnh từ Arduino
    switch(data.command.command) {
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
  });
});
