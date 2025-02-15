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

declare global {
  interface Window {
    connectedGamepadApi: AsyncApiMethods<ConnectedGamepadApi>;
    gamepadConfigApi: AsyncApiMethods<GamepadConfigApi>;
    cameraApi: AsyncApiMethods<CameraApi>;
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
