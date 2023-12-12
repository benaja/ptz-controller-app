import { setupApi } from '@/api/setupApi';
import { setupGamepads } from '@/gamepad/setupGamepads';
import {
  setupCameraConnectionHandler,
  useCameraConnectionHandler,
} from './CameraConnection/CameraConnectionHandler';
import { GamepadApi } from '@/api/gamepadApi';
import { CameraApi } from '@/api/cameraApi';
import { ObsMixer } from '@/VideoMixer/Obs/ObsMixer';
import { VideoMixerApi } from '@/api/videoMixerApi';
import { setupVideoMixHandler } from '@/VideoMixer/VideoMixHanlder';
// import { default as OBSWebSocket } from 'obs-websocket-js';
// import default from '../../../../tailwind.config';
// const OBSWebSocket = require('obs-websocket-js').default;

export function setupCore() {
  setupVideoMixHandler([new ObsMixer()]);

  setupCameraConnectionHandler();

  // console.log('websocket', websocket);
  // websocket.connect({ address: 'localhost:4444' });

  setupApi([new GamepadApi(), new CameraApi(), new VideoMixerApi()]);
  setupGamepads();
}

export function teardownCore() {
  useCameraConnectionHandler()?.dispose();
}
