import { CameraConfig, userConfigStore } from '@/store/userStore';
import { randomUUID } from 'crypto';

export class CameraApi {
  addCameraEndpoint(camera: Omit<CameraConfig, 'id'>) {
    const cameras = userConfigStore.get('cameras');
    cameras.push({
      ...camera,
      id: randomUUID(),
    });
    userConfigStore.set('cameras', cameras);
  }

  removeCameraEndpoint(id: string) {
    const cameras = userConfigStore.get('cameras');
    const index = cameras.findIndex((c) => c.id === id);

    if (index === -1) return;
    cameras.splice(index, 1);
    userConfigStore.set('cameras', cameras);
  }

  updateCameraEndpoint(camera: CameraConfig) {
    const cameras = userConfigStore.get('cameras');
    const index = cameras.findIndex((c) => c.id === camera.id);
    if (index === -1) return;
    cameras.splice(index, 1, camera);
    userConfigStore.set('cameras', cameras);
  }

  getCamerasEndpoint() {
    return userConfigStore.get('cameras');
  }

  getCameraEndpoint(id: string) {
    const cameras = userConfigStore.get('cameras');
    return cameras.find((c) => c.id === id);
  }
}
