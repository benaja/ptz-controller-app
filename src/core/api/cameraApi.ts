import { CameraFactory } from '@core/CameraConnection/CameraFactory';
import { randomUUID } from 'crypto';

type CameraConfig = CameraFactory['store']['data']['cameras'][0];

export type CameraResponse = CameraConfig & { connected: boolean };

export class CameraApi {
  constructor(private _cameraConnectionFactory: CameraFactory) {}

  async addCamera(data: Omit<CameraConfig, 'id'>) {
    const schema = this._cameraConnectionFactory.validationSchema(data.type);

    schema.omit({ id: true }).parse(data);

    const cameras = this._cameraConnectionFactory.store.get('cameras');
    const newCamera = {
      ...data,
      id: randomUUID(),
    } as CameraConfig;

    cameras.push(newCamera);
    this._cameraConnectionFactory.store.set('cameras', cameras);
    await this._cameraConnectionFactory.add(newCamera);
  }

  async removeCamera(id: string) {
    const cameras = this._cameraConnectionFactory.store.get('cameras');
    const index = cameras.findIndex((c) => c.id === id);
    const camera = cameras[index];

    if (index === -1) return;
    cameras.splice(index, 1);
    this._cameraConnectionFactory.store.set('cameras', cameras);
    await this._cameraConnectionFactory.remove(camera.id);
  }

  async updateCamera(data: CameraConfig) {
    const schema = this._cameraConnectionFactory.validationSchema(data.type);

    schema.omit({ id: true }).parse(data);

    const cameras = this._cameraConnectionFactory.store.get('cameras');
    const index = cameras.findIndex((c) => c.id === data.id);
    if (index === -1) return;
    cameras.splice(index, 1, data);
    this._cameraConnectionFactory.store.set('cameras', cameras);

    await this._cameraConnectionFactory.remove(data.id);
    await this._cameraConnectionFactory.add(data);
  }

  getCameras(): CameraResponse[] {
    return this._cameraConnectionFactory.store.get('cameras').map((c) => ({
      ...c,
      connected: this._cameraConnectionFactory.getCameraConnection(c.number)?.connected ?? false,
    }));
  }

  getCamera(id: string): CameraResponse | null {
    const cameras = this._cameraConnectionFactory.store.get('cameras');
    const camera = cameras.find((c) => c.id === id);

    if (!camera) return null;

    return {
      ...camera,
      connected:
        this._cameraConnectionFactory.getCameraConnection(camera.number)?.connected ?? false,
    };
  }
}
