import { CameraConfig } from '@core/CameraConnection/CameraConnectionBuilder';
import {
  ButtonEventPayload,
  ConnectedGamepad,
  ConnectedGamepadResponse,
} from '@core/api/ConnectedGamepadApi';
import { CameraApi, CameraResponse } from '@core/api/cameraApi';
import { GamepadConfigApi, GamepadResponse } from '@core/api/gamepadConfigApi';
import { VideoMixerApi } from '@core/api/videoMixerApi';
import { GamepadConfig } from '@core/store/userStore';

export interface IConnectedGamepadApi {
  getConnectedGamepads: () => Promise<ConnectedGamepadResponse[]>;
  gamepadConnected: (gamepad: ConnectedGamepad) => Promise<void>;
  gamepadDisconnected: (gamepad: ConnectedGamepad) => Promise<void>;
  updateConnectedGamepads: (gamepads: ConnectedGamepad[]) => Promise<void>;
  triggerButtonEvent: (event: ButtonEventPayload) => Promise<void>;
  triggerAxisEvent: (event: ButtonEventPayload) => Promise<void>;
}

export interface IGamepadConfigApi {
  addGamepad: (config: Omit<GamepadConfig, 'id'>) => Promise<GamepadConfig>;
  updateGamepad: (gamepad: GamepadConfig) => Promise<void>;
  removeGamepad: (id: string) => Promise<void>;
  getGamepad: (id: string) => Promise<GamepadResponse>;
  getGamepads: () => Promise<GamepadResponse[]>;
}

export interface ICameraApi {
  addCamera: (camera: Omit<CameraConfig, 'id'>) => Promise<any>;
  removeCamera: (id: string) => Promise<any>;
  updateCamera: (camera: CameraConfig) => Promise<any>;
  getCameras: () => Promise<CameraResponse[]>;
  getCamera: (id: string) => Promise<CameraResponse | null>;
}

declare global {
  interface Window {
    connectedGamepadApi: IConnectedGamepadApi;
    gamepadConfigApi: IConnectedGamepadApi;
    cameraApi: ICameraApi;
  }
}
