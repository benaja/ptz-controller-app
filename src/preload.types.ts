import { Gamepad, GamepadEvent } from '@core/api/gamepadApi';
import { VideoMixerOption } from '@core/api/videoMixerApi';
import { CameraConfig, VideoMixerConfig } from '@core/store/userStore';

export interface IElectronAPI {
  updateSelectedGamepad: (args: {
    type: 'primary' | 'secondary';
    connectionIndex: number | null;
  }) => Promise<void>;
  getSelectedGamepad: (args: { type: 'primary' | 'secondary' }) => Promise<Gamepad | null>;
  getConnectedGamepads: () => Promise<Gamepad[]>;
  gamepadEvent(event: GamepadEvent): Promise<void>;
  newCammeraConnected: (callback: () => void) => () => void;
  onGamepadEvent: (callback: (event: any, gamepadEvent: GamepadEvent) => void) => () => void;
  onSystemResume: (callback: () => void) => () => void;

  addCamera(args: Omit<CameraConfig, 'id'>): Promise<void>;
  removeCamera(id: string): Promise<void>;
  updateCamera(args: CameraConfig): Promise<void>;
  getCameras(): Promise<CameraConfig[]>;
  getCamera(id: string): Promise<CameraConfig | null>;

  getSelectedVideoMixer(): Promise<VideoMixerConfig>;
  updateSelectedVideoMixer(args: VideoMixerConfig): Promise<void>;
  getAvailableVideoMixers(): Promise<VideoMixerOption[]>;
}

declare global {
  interface Window {
    electronApi: IElectronAPI;
  }
}
