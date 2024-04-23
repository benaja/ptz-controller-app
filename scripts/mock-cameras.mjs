import { WebSocketServer } from 'ws';

const AMOUNT_OF_CAMERAS = 1;

function startConnection(cameraId) {
  function log(...args) {
    console.log(`[Camera: ${cameraId}] `, ...args);
  }

  const wss = new WebSocketServer({
    port: 3004,
    host: '192.178.1.65',
  });

  wss.on('connection', (ws) => {
    log('connection');

    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      log('message from client:', message);

      if (message.action === 'getCurrentPosition') {
        ws.send(
          JSON.stringify({
            payload: {
              pan: Math.round(Math.random() * 500),
              tilt: Math.round(Math.random() * 500),
              zoom: Math.round(Math.random() * 500),
            },
          }),
        );
      }
    });

    ws.on('close', () => {
      log('close');
    });

    ws.on('error', (error) => {
      log('error', error);
    });
  });
}

for (let i = 0; i < AMOUNT_OF_CAMERAS; i++) {
  startConnection(i + 1);
}
