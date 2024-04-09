import { IBuilder } from '@core/GenericFactory/IBuilder';
import { ICameraConnection } from './ICameraConnection';
import { CameraConnectionType } from './CameraConnectionTypes';
import { ArduinoPtzCamera, arduinoPtzCameraSchema } from './ArduinoPtzCamera/ArduinoPtzCamera';
import { CgfPtzCamera, cgfPtzCamera } from './CgfPtzCamera/CgfPtzCamera';
import { z } from 'zod';

export const cameraConfigSchema = z.union([arduinoPtzCameraSchema, cgfPtzCamera]);

export type CameraConfig = z.infer<typeof cameraConfigSchema>;

export class CameraConnectionBuilder implements IBuilder<ICameraConnection> {
  public async supportedTypes(): Promise<string[]> {
    return [CameraConnectionType.ArduinoPtzCamera, CameraConnectionType.CgfPtzCamera];
  }

  public validationSchema() {
    return arduinoPtzCameraSchema;
  }

  public async build(config: CameraConfig): Promise<ICameraConnection> {
    switch (config.type) {
      case CameraConnectionType.CgfPtzCamera:
        return new CgfPtzCamera(config);
      case CameraConnectionType.ArduinoPtzCamera:
        return new ArduinoPtzCamera(config);
    }
  }
}
