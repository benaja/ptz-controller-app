import { setupApi } from '@/api/setupApi';
import { setupGamepads } from '@/gamepad/setupGamepads';
import {
  setupCameraConnectionHandler,
  useCameraConnectionHandler,
} from './CameraConnection/CameraConnectionHandler';
import { GamepadApi } from '@/api/gamepadApi';
import { CameraApi } from '@/api/cameraApi';

export function setupCore() {
  setupCameraConnectionHandler();

  setupApi([new GamepadApi(), new CameraApi()]);
  setupGamepads();
}

export function teardownCore() {
  useCameraConnectionHandler()?.dispose();
}
