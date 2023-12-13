#!/usr/bin/env node
import { WebSocketServer } from 'ws';

type Message = {
  pan: number;
  tilt: number;
  zoom: number;
  focus: boolean;
};

export function startConnection(cameraId: number) {
  function log(...args: any[]) {
    console.log(`[Camera: ${cameraId}] `, ...args);
  }

  const wss = new WebSocketServer({
    port: 3004,
    host: '127.0.0.' + cameraId,
  });

  wss.on('connection', (ws) => {
    log('connection');

    ws.on('message', (data: Buffer) => {
      const message = JSON.parse(data.toString()) as Message;
      log('message from client:', message);
    });
  });
}
