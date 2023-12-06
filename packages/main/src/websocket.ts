import WebSocket, { WebSocketServer } from 'ws';
import { emit } from './events/eventBus';

const wss = new WebSocketServer({
  port: 3000,
  host: '0.0.0.0', // specify host so that remoteAddress is shown as ipv4
});

export const clients: Map<number, WebSocket> = new Map();

type Message = {
  ID: number;
};

console.log('websocket server started');

wss.on('connection', (ws, request) => {
  console.log('connection');
  let cameraId: number;
  ws.onerror = (error) => {};

  ws.on('message', (data: Buffer) => {
    const message = JSON.parse(data.toString()) as Message;
    cameraId = message.ID;
    console.log('message from client:', message);

    clients.set(cameraId, ws);

    emit('cameraConnected', cameraId);
  });

  ws.on('close', () => {
    console.log('close', cameraId);
    clients.delete(cameraId);
  });
});
