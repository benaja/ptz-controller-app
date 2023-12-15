import { CameraConfig } from '@core/CameraConnection/CameraConnectionBuilder';
import { VideoMixerConfig } from '@core/VideoMixer/VideoMixerBuilder';
import {
  AxisEventPayload,
  ButtonEventPayload,
  ConnectedGamepad,
  ConnectedGamepadResponse,
} from '@core/api/ConnectedGamepadApi';
import { CameraResponse } from '@core/api/cameraApi';
import { GamepadResponse } from '@core/api/gamepadConfigApi';
import { GamepadConfig } from '@core/store/userStore';

export interface IConnectedGamepadApi {
  getConnectedGamepads: () => Promise<ConnectedGamepadResponse[]>;
  gamepadConnected: (gamepad: ConnectedGamepad) => Promise<void>;
  gamepadDisconnected: (gamepad: ConnectedGamepad) => Promise<void>;
  updateConnectedGamepads: (gamepads: ConnectedGamepad[]) => Promise<void>;
  triggerButtonEvent: (event: ButtonEventPayload) => Promise<void>;
  triggerAxisEvent: (event: AxisEventPayload) => Promise<void>;
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

export interface IVideoMixerApi {
  getVideoMixers: () => Promise<VideoMixerConfig[]>;
  getVideoMixer: (id: string) => Promise<VideoMixerConfig | undefined>;
  addVideoMixer: (videoMixer: Omit<VideoMixerConfig, 'id'>) => Promise<VideoMixerConfig>;
  removeVideoMixer: (id: string) => Promise<void>;
  updateVideoMixer: (videoMixer: VideoMixerConfig) => Promise<void>;
}

declare global {
  interface Window {
    connectedGamepadApi: IConnectedGamepadApi;
    gamepadConfigApi: IGamepadConfigApi;
    cameraApi: ICameraApi;
    videoMixerApi: IVideoMixerApi;
  }
}
