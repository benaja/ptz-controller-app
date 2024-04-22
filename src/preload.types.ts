import { ConnectedGamepadApi } from '@core/api/ConnectedGamepadApi';
import { CameraApi } from '@core/api/CameraApi';
import { GamepadConfigApi } from '@core/api/GamepadConfigApi';
import { VideoMixerApi } from '@core/api/videoMixerApi';
import { NotificationApi } from '@core/api/NotificationApi';

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
  }
}
