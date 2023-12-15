import { Core } from '@core/index';
import { setupElectronApi } from './electronApi/setupElectronApi';
import { CameraConnectionBuilder } from '@core/CameraConnection/CameraConnectionBuilder';
import { VideoMixerBuilder } from '@core/VideoMixer/VideoMixerBuilder';
import { BrowserGamepadBuilder } from './Gamepad/BrowserGamepadBuilder';

export async function setupApp() {
  const core = new Core();

  await core.cameraFactory.addBuilder(new CameraConnectionBuilder());
  await core.mixerFactory.addBuilder(new VideoMixerBuilder());
  await core.gamepadFactory.addBuilder(new BrowserGamepadBuilder());

  setupElectronApi([core.gamepadConfigApi, core.connectedGamepadApi, core.cameraApi]);

  core.bootstrap();
}
