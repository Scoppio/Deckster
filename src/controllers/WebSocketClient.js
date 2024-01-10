
import { w3cwebsocket as W3CWebSocket } from "websocket";

export class GameEvent {
  constructor(type, sender, payload) {
    this.type = type
    this.sender = sender
    this.payload = payload
  }

  static fromMessage(message) {
    return new GameEvent(JSON.parse(message.data))
  }
}

export class WebSocketClient {
  constructor(gameName) {
    this.listeners = [] 

    this.client = new W3CWebSocket('ws://'
      // + window.location.host
      + "localhost:8000"
      + '/ws/vtt/game/'
      + gameName
      + '/'
    )

    this.client.onclose = (e) => {
      console.error('Chat socket closed unexpectedly', e);
    }

    this.client.onopen = () => {
      console.log("WebSocket Client Connected");
    }

    this.client.onmessage = (message) => {
      const event = GameEvent.fromMessage(message);
      this.onEventReceived(message)
    }
  }

  addListener(listener) {
    this.listeners.push(listener)
    return this
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener)
    return this
  }

  sendEvent(event) {
    return new Promise((resolve, reject) => {
      const waitForOpen = setInterval(() => {
        if (this.client.readyState === this.client.OPEN) {
          clearInterval(waitForOpen);
          this.client.send(JSON.stringify({...event}));
          resolve(this);
        } else if (this.client.readyState > this.client.OPEN) {
          clearInterval(waitForOpen);
          reject(new Error('WebSocket is not open'));
        }
      }, 100);
    });
  }

  onEventReceived(event) {
    this.listeners.forEach((listener) => {
      listener.handleEvent(JSON.parse(event.data))
    })
  }
}
