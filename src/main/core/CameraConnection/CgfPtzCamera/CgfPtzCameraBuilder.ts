import { CgfPtzCamera } from './CgfPtzCamera';
import { IBuilder } from '../../GenericFactory/IBuilder';
import { ICameraConnection } from '../ICameraConnection';
import { CameraConfig } from '@main/store/userStore';

export class CgfPtzCameraBuilder implements IBuilder<ICameraConnection> {
  public supportedTypes(): Promise<string[]> {
    return Promise.resolve(['Cgf.PtzCamera']);
  }

  public build(config: CameraConfig): Promise<ICameraConnection> {
    return Promise.resolve(new CgfPtzCamera(config));
  }
}
