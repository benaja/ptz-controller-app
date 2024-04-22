import { CameraFactory } from '@core/CameraConnection/CameraFactory';
import { CameraRepository } from '@core/repositories/CameraRepository';

export type CameraConfig = CameraRepository['items'][0];

export type CameraResponse = CameraConfig & { connected: boolean };

export class CameraApi {
  constructor(
    private _cameraConnectionFactory: CameraFactory,
    private _cameraRepository: CameraRepository,
  ) {}

  async addCamera(data: Omit<CameraConfig, 'id'>) {
    const camera = this._cameraRepository.add(data);

    await this._cameraConnectionFactory.add(camera);
  }

  async removeCamera(id: string) {
    this._cameraRepository.delete(id);
    await this._cameraConnectionFactory.remove(id);
  }

  async updateCamera(data: Partial<CameraConfig> & { id: string }) {
    const camera = this._cameraRepository.update(data.id, data);
    if (!camera) return;

    await this._cameraConnectionFactory.remove(data.id);
    await this._cameraConnectionFactory.add(camera);
  }

  getCameras(): CameraResponse[] {
    return this._cameraRepository.getAll().map((c) => ({
      ...c,
      connected: this._cameraConnectionFactory.getCameraConnection(c.sourceId)?.connected || false,
    }));
  }

  getCamera(id: string): CameraResponse | null {
    const camera = this._cameraRepository.getById(id);

    if (!camera) return null;

    return {
      ...camera,
      connected:
        !!this._cameraConnectionFactory.getCameraConnection(camera.sourceId)?.connected || false,
    };
  }
}
