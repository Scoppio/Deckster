import { w3cwebsocket as W3CWebSocket } from "websocket";

export class WebSocketClient {
  constructor(url, gameName) {
    this.listeners = [];
    this.token = "48676c9575d39469d8223388a60930018aef7144";
    this.client = new W3CWebSocket(
      "wss://" +
        url +
        "/ws/vtt/game/" +
        gameName +
        "/?token=" + this.token
    );

    this.client.onclose = (e) => {
      console.error("Chat socket closed unexpectedly", e);
    };

    this.client.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    this.client.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };
    
    this.client.onmessage = (message) => {
      this.onEventReceived(message);
    };
  }

  addListener(listener) {
    this.listeners.push(listener);
    return this;
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
    return this;
  }

  sendEvent(event) {
    return new Promise((resolve, reject) => {
      const waitForOpen = setInterval(() => {
        if (this.client.readyState === this.client.OPEN) {
          clearInterval(waitForOpen);
          this.client.send(JSON.stringify({ ...event }));
          resolve(this);
        } else if (this.client.readyState > this.client.OPEN) {
          clearInterval(waitForOpen);
          // reject(new Error('WebSocket is not open'));
        }
      }, 100);
    });
  }

  onEventReceived(event) {
    this.listeners.forEach((listener) => {
      listener.handleEvent(JSON.parse(event.data));
    });
  }
}
