import { Factory } from '../GenericFactory/Factory';
import { ICameraConnection } from './ICameraConnection';
import { CameraRepository } from '../repositories/CameraRepository';

export class CameraFactory extends Factory<ICameraConnection> {
  constructor(public cameraRepository: CameraRepository) {
    super();
  }

  getCameraConnection(sourceId: string): ICameraConnection | undefined {
    return Object.values(this._instances).find((c) => c.sourceId === sourceId);
  }
}
