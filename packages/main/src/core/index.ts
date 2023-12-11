import { setupApi } from '@/api/setupApi';
import { setupGamepads } from '@/gamepad/setupGamepads';
import { startWebsocketServer, stopWebsocketServer } from '@/websocket';

export function setupCore() {
  startWebsocketServer();
  setupApi();
  setupGamepads();
}

export function teardownCore() {
  stopWebsocketServer();
}
