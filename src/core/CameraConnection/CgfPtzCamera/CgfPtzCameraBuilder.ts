import { CgfPtzCamera } from './CgfPtzCamera';
import { IBuilder } from '../../GenericFactory/IBuilder';
import { ICameraConnection } from '../ICameraConnection';
import { CameraConfig } from '@core/store/userStore';
import { CameraConnectionType } from '../CameraConnectionTypes';

export class CgfPtzCameraBuilder implements IBuilder<ICameraConnection> {
  public async supportedTypes(): Promise<string[]> {
    return [CameraConnectionType.CgfPtzCamera];
  }

  public build(config: CameraConfig): Promise<ICameraConnection> {
    return Promise.resolve(new CgfPtzCamera(config));
  }
}
