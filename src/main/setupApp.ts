import { Core } from '@core/index';
import { setupElectronApi } from './electronApi/setupElectronApi';
import { ArduinoPtzCameraBuilder } from '@core/CameraConnection/ArduinoPtzCameraBuilder';
import { BrowserGamepadBuilder } from '../core/Gamepad/BrowserGamepad/BrowserGamepadBuilder';
import { ObsVideoMixerBuilder } from '@core/VideoMixer/Obs/ObsVideoMixerBuilder';

export async function setupApp() {
  const core = new Core();

  await core.cameraFactory.addBuilder(new ArduinoPtzCameraBuilder());
  await core.mixerFactory.addBuilder(new ObsVideoMixerBuilder());

  await core.gamepadFactory.addBuilder(
    new BrowserGamepadBuilder(core.cameraFactory, core.mixerFactory),
  );

  setupElectronApi([
    core.gamepadConfigApi,
    core.connectedGamepadApi,
    core.cameraApi,
    core.videoMixerApi,
  ]);

  core.bootstrap();
}
