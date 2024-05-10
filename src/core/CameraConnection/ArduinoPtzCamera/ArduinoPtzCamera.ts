import { ICameraConnection, baseCameraConfigSchema } from '../ICameraConnection';
import WebSocket from 'ws';
import { throttle } from '@main/utils/throttle';
import { RelativeCameraState } from './AurduinoPtzCameraState';
import { CameraConnectionType } from '../CameraConnectionTypes';
import { z } from 'zod';
import log from 'electron-log/main';

export const arduinoPtzCameraSchema = baseCameraConfigSchema.extend({
  type: z.literal(CameraConnectionType.ArduinoPtzCamera),
  ip: z.string().ip(),
});

export type ArduionoPtzCameraConfig = z.infer<typeof arduinoPtzCameraSchema>;

export class ArduinoPtzCamera implements ICameraConnection {
  public id: string;
  private websocket: WebSocket | undefined;
  private _connected = false;
  private reconnect = true;
  private relativeState = new RelativeCameraState();

  public readonly displayName = 'Arduino Ptz Camera';
  public readonly type = CameraConnectionType.ArduinoPtzCamera;

  public readonly sourceId: string;

  private _lastPongReceived: number | null = Date.now();

  constructor(public config: ArduionoPtzCameraConfig) {
    this.sourceId = config.sourceId;
    this.id = config.id;
    this.setupWebsocket();
  }

  public get connected(): boolean {
    return this._connected;
  }

  public set connected(v: boolean) {
    this._connected = v;
  }

  public get connectionString(): string {
    return this.config.ip;
  }

  private pingInterval: NodeJS.Timeout | undefined;

  setupWebsocket() {
    this._lastPongReceived = null;
    log.info('setting up websocket: ', this.config.ip);
    // if (!this.reconnect || this.websocket?.readyState === WebSocket.OPEN) return;
    this.websocket = new WebSocket(`ws://${this.config.ip}:3004`);

    this.websocket.on('open', () => {
      log.info('websocket connected: ', this.config.ip);
      this.connected = true;

      this.pingInterval = setInterval(() => {
        if (this._lastPongReceived && Date.now() - this._lastPongReceived > 11000) {
          console.log('no pong received in 11 seconds');
          this.onClose();
        }
        if (!this.websocket) {
          log.error('cannot ping, no websocket');
          return;
        }
        console.log('pinging');
        try {
          this.websocket.ping();
        } catch (error) {
          console.log('error pinging', error);
          log.error('error pinging', error);
        }
      }, 5000);
    });

    this.websocket.on('close', (e, reason) => {
      log.info('websocket closed', e, reason);
      this.onClose();
    });

    this.websocket.on('error', (error) => {
      log.error('websocket error', error, this.config.ip);
    });

    console.log('setting up pong listener');
    this.websocket.on('pong', () => {
      console.log('pong received');
      this._lastPongReceived = Date.now();
    });

    // this.websocket.on('message', (data: WebSocket.Data) => {
    //   console.log('message from server:', data.toString());
    // });
  }

  private onClose() {
    this.connected = false;
    this.websocket?.removeAllListeners();
    clearInterval(this.pingInterval);
    if (this.reconnect) {
      setTimeout(this.setupWebsocket.bind(this), 1000);
    }
  }

  dispose(): void {
    this.reconnect = false;
    this.websocket?.close();
  }

  pan(value: number): void {
    if (this.config.isUpsideDown) {
      value = -value;
    }

    this.relativeState.pan = value;
    this.sheduleUpdate('move', this.relativeState);
  }

  tilt(value: number): void {
    if (this.config.isUpsideDown) {
      value = -value;
    }

    this.relativeState.tilt = value;
    this.sheduleUpdate('move', this.relativeState);
  }

  zoom(value: number): void {
    this.relativeState.zoom = value;
    this.sheduleUpdate('move', this.relativeState);
  }

  focus(value: number): void {
    this.sendUpdate('focus', { value });
  }

  setAutoFocus(value: boolean): void {
    this.sendUpdate('setAutofocus', { value });
  }

  toggleAutoFocus(): void {
    this.sendUpdate('toggleAutofocus');
  }

  setTally(state: 'preview' | 'live' | ''): void {
    this.sendUpdate('setTally', {
      tally: state,
    });
  }

  sheduleUpdate = throttle((action: string, data?: Record<string, any>) => {
    this.sendUpdate(action, data);
  }, 50);

  sendUpdate(action: string, data?: Record<string, any>): void {
    log.info('sending update to', this.config.ip, action, data);
    try {
      // this.websocket?.send('hey');
      this.websocket?.send(
        JSON.stringify({
          action,
          payload: data,
        }),
      );
    } catch (error) {
      console.log('error sending update', error);
      log.error('error sending update', error);
    }
  }

  getCurrentPosition(): Promise<{
    pan: number;
    tilt: number;
    zoom: number;
    focus: number;
  }> {
    return new Promise((resolve, reject) => {
      this.websocket?.once('message', (data: WebSocket.Data) => {
        const response = JSON.parse(data.toString());

        log.info('current Position', response.payload);
        if (response.payload.zoom && typeof response.payload.zoom === 'string') {
          response.payload.zoom = 0;
        }

        resolve(response.payload);

        console.log('message from server:', data.toString());
      });
      this.sendUpdate('getCurrentPosition');
    });
  }

  goToPosition(position: { pan: number; tilt: number; speed: number }): void {
    this.sendUpdate('goToPosition', position);
  }
}
