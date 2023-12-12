import { CameraConfig } from '@/store/userStore';
import { Emitter } from 'strict-event-emitter';

type Events = {
  cameraAdded: [config: CameraConfig];
  cameraRemoved: [config: CameraConfig];
  cameraUpdated: [config: CameraConfig];
  cameraConnected: [config: CameraConfig];
  cameraDisconnected: [config: CameraConfig];
};

export const eventEmitter = new Emitter<Events>();
