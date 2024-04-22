import { IBuilder } from '@core/GenericFactory/IBuilder';
import { ICameraConnection } from './ICameraConnection';
import { CameraConnectionType } from './CameraConnectionTypes';
import {
  ArduinoPtzCamera,
  ArduionoPtzCameraConfig,
  arduinoPtzCameraSchema,
} from './ArduinoPtzCamera/ArduinoPtzCamera';
import { NotificationApi } from '@core/api/NotificationApi';

// export const cameraConfigSchema = z.union([arduinoPtzCameraSchema, cgfPtzCamera]);

// export type CameraConfig = z.infer<typeof cameraConfigSchema>;

export class ArduinoPtzCameraBuilder implements IBuilder<ICameraConnection> {
  public constructor(private _notificationApi: NotificationApi) {}

  public supportedTypes() {
    return [CameraConnectionType.ArduinoPtzCamera];
  }

  public validationSchema() {
    return arduinoPtzCameraSchema;
  }

  public async build(config: ArduionoPtzCameraConfig): Promise<ICameraConnection> {
    switch (config.type) {
      case CameraConnectionType.ArduinoPtzCamera:
        return new ArduinoPtzCamera(config);
      default:
        throw new Error(`Camera type ${config.type} not supported`);
    }
  }
}
