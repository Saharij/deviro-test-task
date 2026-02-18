import { trackingStore } from "../stores/trackingStore";

class WSService {
  private ws: WebSocket | null = null;

  connect(token: string, onUnauthorized: () => void) {
    this.disconnect();

    const params = new URLSearchParams({ token });
    this.ws = new WebSocket(`ws://localhost:3001?${params.toString()}`);

    this.ws.onopen = () => {
      console.log("WS connected");
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "INIT") {
        trackingStore.setInitialData(message.payload);
      }

      if (message.type === "UPDATE") {
        trackingStore.updateData(message.payload);
      }
    };

    this.ws.onerror = (err) => {
      console.error("WS error", err);
    };

    this.ws.onclose = (event) => {
      console.log("WS disconnected");
      this.ws = null;

      if (event.code === 1008) {
        onUnauthorized();
      }
    };
  }

  disconnect() {
    if (!this.ws) {
      return;
    }

    this.ws.close();
    this.ws = null;
  }
}

export const wsService = new WSService();
