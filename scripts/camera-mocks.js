import { WebSocketServer } from 'ws';

const AMOUNT_OF_CAMERAS = 4;

function startConnection(cameraId) {
  function log(...args) {
    console.log(`[Camera: ${cameraId}] `, ...args);
  }

  const wss = new WebSocketServer({
    port: 3004,
    host: '127.0.0.' + cameraId,
  });

  wss.on('connection', (ws) => {
    log('connection');

    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      log('message from client:', message);
    });
  });
}

for (let i = 0; i < AMOUNT_OF_CAMERAS; i++) {
  startConnection(i + 1);
}
