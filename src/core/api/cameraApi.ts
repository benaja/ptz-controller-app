import { CameraConfig } from '@core/CameraConnection/CameraConnectionBuilder';
import { CameraConnectionFactory } from '@core/CameraConnection/CameraConnectionFactory';
import { UserConfigStore } from '@core/store/userStore';
import { randomUUID } from 'crypto';

export type CameraResponse = CameraConfig & { connected: boolean };

export class CameraApi {
  constructor(
    private _cameraConnectionFactory: CameraConnectionFactory,
    private _userConfigStore: UserConfigStore,
  ) {}

  async addCamera(camera: Omit<CameraConfig, 'id'>) {
    const cameras = this._userConfigStore.get('cameras');
    const newCamera = {
      ...camera,
      id: randomUUID(),
    };
    cameras.push(newCamera);
    this._userConfigStore.set('cameras', cameras);
    await this._cameraConnectionFactory.add(newCamera);
  }

  async removeCamera(id: string) {
    const cameras = this._userConfigStore.get('cameras');
    const index = cameras.findIndex((c) => c.id === id);
    const camera = cameras[index];

    if (index === -1) return;
    cameras.splice(index, 1);
    this._userConfigStore.set('cameras', cameras);
    await this._cameraConnectionFactory.remove(camera.id);
  }

  async updateCamera(camera: CameraConfig) {
    const cameras = this._userConfigStore.get('cameras');
    const index = cameras.findIndex((c) => c.id === camera.id);
    if (index === -1) return;
    cameras.splice(index, 1, camera);
    this._userConfigStore.set('cameras', cameras);

    await this._cameraConnectionFactory.remove(camera.id);
    await this._cameraConnectionFactory.add(camera);
  }

  getCameras(): CameraResponse[] {
    return this._userConfigStore.get('cameras').map((c) => ({
      ...c,
      connected: this._cameraConnectionFactory.getCameraConnection(c.number)?.connected ?? false,
    }));
  }

  getCamera(id: string): CameraResponse | null {
    const cameras = this._userConfigStore.get('cameras');
    const camera = cameras.find((c) => c.id === id);

    if (!camera) return null;

    return {
      ...camera,
      connected:
        this._cameraConnectionFactory.getCameraConnection(camera.number)?.connected ?? false,
    };
  }
}
