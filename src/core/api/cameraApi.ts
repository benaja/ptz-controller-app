import { CameraConfig } from '@core/CameraConnection/CameraConnectionBuilder';
import { CameraConnectionFactory } from '@core/CameraConnection/CameraConnectionFactory';
import { randomUUID } from 'crypto';
import { UserconfigStore } from '../store/userStore';

export type CameraResponse = CameraConfig & { connected: boolean };

export class CameraApi {
  constructor(
    private cameraConnectionFactory: CameraConnectionFactory,
    private userConfigStore: UserconfigStore,
  ) {}

  async addCamera(camera: Omit<CameraConfig, 'id'>) {
    const cameras = this.userConfigStore.get('cameras');
    const newCamera = {
      ...camera,
      id: randomUUID(),
    };
    cameras.push(newCamera);
    this.userConfigStore.set('cameras', cameras);
    await this.cameraConnectionFactory.add(newCamera);
  }

  async removeCamera(id: string) {
    const cameras = this.userConfigStore.get('cameras');
    const index = cameras.findIndex((c) => c.id === id);
    const camera = cameras[index];

    if (index === -1) return;
    cameras.splice(index, 1);
    this.userConfigStore.set('cameras', cameras);
    await this.cameraConnectionFactory.remove(camera);
  }

  async updateCamera(camera: CameraConfig) {
    const cameras = this.userConfigStore.get('cameras');
    const index = cameras.findIndex((c) => c.id === camera.id);
    if (index === -1) return;
    cameras.splice(index, 1, camera);
    this.userConfigStore.set('cameras', cameras);

    await this.cameraConnectionFactory.remove(camera.id);
    await this.cameraConnectionFactory.add(camera);
  }

  getCameras(): CameraResponse[] {
    return this.userConfigStore.get('cameras').map((c) => ({
      ...c,
      connected: this.cameraConnectionFactory.getCameraConnection(c.number)?.connected ?? false,
    }));
  }

  getCameraEndpoint(id: string): CameraResponse | null {
    const cameras = this.userConfigStore.get('cameras');
    const camera = cameras.find((c) => c.id === id);

    if (!camera) return null;

    return {
      ...camera,
      connected:
        this.cameraConnectionFactory.getCameraConnection(camera.number)?.connected ?? false,
    };
  }
}
