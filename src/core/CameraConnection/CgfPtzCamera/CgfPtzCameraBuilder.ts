import { CgfPtzCamera } from './CgfPtzCamera';
import { IBuilder } from '../../GenericFactory/IBuilder';
import { ICameraConnection } from '../ICameraConnection';
import { CameraConnectionType } from '../CameraConnectionTypes';

export class CgfPtzArduinoPtzCamera implements IBuilder<ICameraConnection> {
  public supportedTypes(): string[] {
    return [CameraConnectionType.CgfPtzCamera];
  }

  public build(config: CameraConfig): Promise<ICameraConnection> {
    return Promise.resolve(new CgfPtzCamera(config));
  }
}
