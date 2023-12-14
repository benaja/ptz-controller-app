import { CameraConfig, VideoMixerConfig } from '@core/store/userStore';
import { Emitter } from 'strict-event-emitter';

type Events = {
  cameraAdded: [config: CameraConfig];
  cameraRemoved: [config: CameraConfig];
  cameraUpdated: [config: CameraConfig];
  cameraConnected: [config: CameraConfig];
  cameraDisconnected: [config: CameraConfig];

  videoMixerUpdated: [config: VideoMixerConfig];
};

export const eventEmitter = new Emitter<Events>();
