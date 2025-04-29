class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(url) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket Connected');
      this.isConnected = true;
    };

    this.socket.onclose = () => {
      console.log('WebSocket Disconnected');
      this.isConnected = false;
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  }

  sendCommand(command) {
    if (this.isConnected && this.socket) {
      this.socket.send(JSON.stringify({ command }));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export const wsService = new WebSocketService(); 