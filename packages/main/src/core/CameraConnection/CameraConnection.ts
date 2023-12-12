import { CameraConfig } from '@/store/userStore';
import { ICameraConnection } from './ICameraConnection';
import { WebSocket } from 'ws';
import { RelativeCameraState } from './CgfPtzCamera/CgfPtzCameraState';
import { throttle } from '@/utils/throttle';
import { eventEmitter } from '@/events/eventEmitter';

export class CameraConnection implements ICameraConnection {
  private websocket: WebSocket | undefined;
  private _connected = false;
  private reconnect = true;
  private relativeState = new RelativeCameraState();

  constructor(private config: CameraConfig) {
    this.setupWebsocket();
  }

  public get connected(): boolean {
    return this._connected;
  }

  public set connected(v: boolean) {
    this._connected = v;

    if (v) {
      eventEmitter.emit('cameraConnected', this.config);
    } else {
      eventEmitter.emit('cameraDisconnected', this.config);
    }
  }

  setupWebsocket() {
    if (!this.reconnect || this.websocket?.readyState === WebSocket.OPEN) return;
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
