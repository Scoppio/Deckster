import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Urls } from "../commons/Urls";

export class WebSocketClient {
  constructor(authorization) {
    this.listeners = []; 
    this.gameName = authorization.gameName;
    this.token = authorization.token;

    this.client = new W3CWebSocket(
      Urls.ws_url +
        "/ws/vtt/g/?game_name=" + encodeURI(this.gameName) + "&token=" + this.token
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

  setToken(token) {
    this.token = token;
    return this;
  }

  startClient() {
    this.client = new W3CWebSocket(
      Urls.ws_url +
        "/ws/vtt/game/" +
        this.gameName +
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
    
    return this;
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
