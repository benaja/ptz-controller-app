import { ICameraConnection, baseCameraConfigSchema } from '../ICameraConnection';
import WebSocket from 'ws';
import { throttle } from '@main/utils/throttle';
import { RelativeCameraState } from './AurduinoPtzCameraState';
import { CameraConnectionType } from '../CameraConnectionTypes';
import { z } from 'zod';

export const arduinoPtzCamera = baseCameraConfigSchema.extend({
  type: z.literal(CameraConnectionType.ArduinoPtzCamera),
  ip: z.string(),
});

export type ArduionoPtzCameraConfig = z.infer<typeof arduinoPtzCamera>;

export class ArduinoPtzCamera implements ICameraConnection {
  private websocket: WebSocket | undefined;
  private _connected = false;
  private reconnect = true;
  private relativeState = new RelativeCameraState();

  public readonly displayName = 'Arduino Ptz Camera';
  public readonly type = CameraConnectionType.ArduinoPtzCamera;

  public get number(): number {
    return this.config.number;
  }

  constructor(private config: ArduionoPtzCameraConfig) {
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

  setupWebsocket() {
    // if (!this.reconnect || this.websocket?.readyState === WebSocket.OPEN) return;
    this.websocket = new WebSocket(`ws://${this.config.ip}:3004`);

    this.websocket.on('open', () => {
      console.log('websocket connected: ', this.config.ip);
      this.connected = true;
    });

    this.websocket.on('close', () => {
      this.connected = false;
      if (this.reconnect) {
        console.log('websocket closed, retrying in 5s: ', this.config.ip);
        setTimeout(this.setupWebsocket.bind(this), 5000);
      }
    });

    this.websocket.on('error', (error) => {
      console.log('websocket error', error, this.config.ip);
    });
  }

  dispose(): void {
    this.reconnect = false;
    this.websocket?.close();
  }

  pan(value: number): void {
    this.relativeState.panRel = value;
    this.sheduleUpdate(this.relativeState);
  }

  tilt(value: number): void {
    this.relativeState.tiltRel = value;
    this.sheduleUpdate(this.relativeState);
  }

  zoom(value: number): void {
    this.relativeState.zoomRel = value;
    this.sheduleUpdate(this.relativeState);
  }

  focus(value: number): void {
    this.sendUpdate({
      focus: value,
    });
  }

  toggleAutoFocus(): void {
    this.sendUpdate({
      autofocus: true,
    });
  }

  setTally(state: 'preview' | 'live' | ''): void {
    this.sendUpdate({
      tally: state,
    });
  }

  sheduleUpdate = throttle((data: Record<string, any>) => {
    this.sendUpdate(data);
  }, 20);

  sendUpdate(data: Record<string, any>): void {
    this.websocket?.send(JSON.stringify(data));
  }
}
