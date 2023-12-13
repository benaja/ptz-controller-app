import {
  CameraConnectionHandler,
  useCameraConnectionHandler,
} from '@main/core/CameraConnection/CameraConnectionHandler';
import { eventEmitter } from '@main/events/eventEmitter';
import { CameraConfig, userConfigStore } from '@main/store/userStore';
import { randomUUID } from 'crypto';

export type CameraResponse = CameraConfig & { connected: boolean };

export class CameraApi {
  private cameraConnectionHanler: CameraConnectionHandler;
  constructor() {
    this.cameraConnectionHanler = useCameraConnectionHandler();
  }

  addCameraEndpoint(camera: Omit<CameraConfig, 'id'>) {
    const cameras = userConfigStore.get('cameras');
    const newCamera = {
      ...camera,
      id: randomUUID(),
    };
    cameras.push(newCamera);
    userConfigStore.set('cameras', cameras);
    eventEmitter.emit('cameraAdded', newCamera);
  }

  removeCameraEndpoint(id: string) {
    const cameras = userConfigStore.get('cameras');
    const index = cameras.findIndex((c) => c.id === id);
    const camera = cameras[index];

    if (index === -1) return;
    cameras.splice(index, 1);
    userConfigStore.set('cameras', cameras);
    eventEmitter.emit('cameraRemoved', camera);
  }

  updateCameraEndpoint(camera: CameraConfig) {
    const cameras = userConfigStore.get('cameras');
    const index = cameras.findIndex((c) => c.id === camera.id);
    if (index === -1) return;
    cameras.splice(index, 1, camera);
    userConfigStore.set('cameras', cameras);
    eventEmitter.emit('cameraUpdated', camera);
  }

  getCamerasEndpoint(): CameraResponse[] {
    return userConfigStore.get('cameras').map((c) => ({
      ...c,
      connected: this.cameraConnectionHanler.getCameraConnection(c.number)?.connected ?? false,
    }));
  }

  getCameraEndpoint(id: string): CameraResponse | null {
    const cameras = userConfigStore.get('cameras');
    const camera = cameras.find((c) => c.id === id);

    if (!camera) return null;

    return {
      ...camera,
      connected: this.cameraConnectionHanler.getCameraConnection(camera.number)?.connected ?? false,
    };
  }
}
