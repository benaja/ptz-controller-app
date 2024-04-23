import { CgfPtzCamera } from './CgfPtzCamera';
import { IBuilder } from '../../GenericFactory/IBuilder';
import { ICameraConnection } from '../ICameraConnection';
import { CameraConnectionType } from '../CameraConnectionTypes';
import { arduinoPtzCameraSchema } from '../ArduinoPtzCamera/ArduinoPtzCamera';
import { CameraConfig } from '@core/api/CameraApi';

export class CgfPtzArduinoPtzCamera implements IBuilder<ICameraConnection> {
  public supportedTypes(): string[] {
    return [CameraConnectionType.CgfPtzCamera];
  }

  public validationSchema() {
    return arduinoPtzCameraSchema;
  }

  public build(config: CameraConfig): Promise<ICameraConnection> {
    // @ts-ignore
    return Promise.resolve(new CgfPtzCamera(config));
  }
}
