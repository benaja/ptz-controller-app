import { registerCameraConnectedListener } from '../../websocket';
import { Factory } from '../GenericFactory/Factory';
import { ICameraConnection } from './ICameraConnection';
import { CgfPtzCamera } from './CgfPtzCamera/CgfPtzCamera';
import { CameraConfig } from '@main/userConfig';

export class CameraConnectionFactory extends Factory<ICameraConnection> {
  public async parseConfig(config: CameraConfig): Promise<void> {
    registerCameraConnectedListener(async (cameraId) => {
      if (cameraId !== config.id) return;

      if (this._instances[cameraId]) {
        console.log(`Factory: Instance for index:${config.id} is already available`);
        return;
      }

      console.log('building instance for cameraId: ', cameraId);

      this._instances[cameraId] = new CgfPtzCamera(config);
    });
  }
}
