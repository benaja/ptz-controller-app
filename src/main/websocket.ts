import WebSocket, { WebSocketServer } from 'ws';
import { emit } from './events/eventBus';
import ip from 'ip';

let wss: WebSocketServer | null = null;

export const clients: Map<number, WebSocket> = new Map();
export const connectedTo: Map<number, WebSocket> = new Map();

type Message = {
  ID: number;
};

export function startWebsocketServer() {
  if (wss) return;

  wss = new WebSocketServer({
    port: 3000,
    host: '0.0.0.0', // specify host so that remoteAddress is shown as ipv4
  });

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
}

export function stopWebsocketServer() {
  if (!wss) return;

  wss.close();
  wss = null;
}

export function connectToServer(cameraId: number, cameraIp: string) {
  const ws = new WebSocket(`ws://${cameraIp}:3004`);
  let timeout: NodeJS.Timeout | null = null;

  ws.on('open', () => {
    connectedTo.set(cameraId, ws);
    const myIp = ip.address();
    console.log('open', myIp);
    ws.send(myIp);
  });

  ws.on('message', (data: Buffer) => {
    console.log('message from server:', data.toString());
  });

  ws.on('close', () => {
    connectedTo.delete(cameraId);
    console.log('close');

    timeout = setTimeout(() => {
      connectToServer(cameraId, cameraIp);
    }, 5000);
  });

  ws.on('error', (error) => {
    console.log('error', error);
    console.log('reconnecting in 5 seconds');
    timeout = setTimeout(() => {
      connectToServer(cameraId, cameraIp);
    }, 1000);
  });
}
