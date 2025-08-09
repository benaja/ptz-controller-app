import { ConnectedGamepadApi } from '@core/api/ConnectedGamepadApi';
import { CameraApi } from '@core/api/CameraApi';
import { GamepadConfigApi } from '@core/api/GamepadConfigApi';
import { VideoMixerApi } from '@core/api/VideoMixerApi';
import { NotificationApi } from '@core/api/NotificationApi';
import { SettingsApi } from '@core/api/SettingsApi';
import { LogsApi } from '@core/api/LogsApi';

type AsyncApiMethods<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? (
        ...args: Parameters<T[K]>
      ) => ReturnType<T[K]> extends Promise<any> ? ReturnType<T[K]> : Promise<ReturnType<T[K]>>
    : never;
};

type CameraControlExtras = {
  controlPanTilt: (args: { cameraId: string; pan: number; tilt: number }) => Promise<void>;
  controlZoom: (args: { cameraId: string; zoom: number }) => Promise<void>;
  getPing: (args: { cameraId: string }) => Promise<number | null>;
};

declare global {
  interface Window {
    connectedGamepadApi: AsyncApiMethods<ConnectedGamepadApi>;
    gamepadConfigApi: AsyncApiMethods<GamepadConfigApi>;
    cameraApi: AsyncApiMethods<CameraApi> & CameraControlExtras;
    videoMixerApi: AsyncApiMethods<VideoMixerApi>;
    notificationApi: AsyncApiMethods<NotificationApi>;
    settingsApi: AsyncApiMethods<SettingsApi>;
    logsApi: AsyncApiMethods<LogsApi> & {
      onLog: (
        callback: (log: Electron.IpcRendererEvent, data: Record<string, any>) => void,
      ) => () => void;
    };
  }
}
