class WebSocketService {
  constructor() {
    this.ws = null;
    this.onMessageCallback = null;
  }

  connect(url) {
    console.log('Attempting to connect to WebSocket at:', url);
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onmessage = (event) => {
      console.log('Received message:', event.data);
      if (this.onMessageCallback) {
        this.onMessageCallback(event.data);
      }
    };
  }

  disconnect() {
    if (this.ws) {
      console.log('Disconnecting WebSocket');
      this.ws.close();
      this.ws = null;
    }
  }

  sendCommand(command) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('Sending command:', command);
      this.ws.send(JSON.stringify({ command }));
    } else {
      console.error('WebSocket is not connected. Current state:', this.ws ? this.ws.readyState : 'null');
    }
  }

  onMessage(callback) {
    this.onMessageCallback = callback;
  }

  offMessage() {
    this.onMessageCallback = null;
  }

  // Kiểm tra trạng thái kết nối
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

export const wsService = new WebSocketService(); 