import { Core } from '@core/index';
import { setupElectronApi } from './electronApi/setupElectronApi';
import { ArduinoPtzCameraBuilder } from '@core/CameraConnection/ArduinoPtzCameraBuilder';
import { BrowserGamepadBuilder } from '../core/Gamepad/BrowserGamepad/BrowserGamepadBuilder';
import { ObsVideoMixerBuilder } from '@core/VideoMixer/Obs/ObsVideoMixerBuilder';
import { VMixBuilder } from '@core/VideoMixer/VMix/VMixBuilder';
import { PassthroughBuilder } from '@core/VideoMixer/Passthrough/PassthroughBuilder';
import { SettingsApi } from '@core/api/SettingsApi';
import { NodeGamepadBuilder } from '@core/Gamepad/NodeGamepad/NodeGamepadBuilder';
import { LogsApi } from '@core/api/LogsApi';

export async function setupApp() {
  const core = new Core();

  await core.cameraFactory.addBuilder(new ArduinoPtzCameraBuilder(core.notificationApi));
  await core.mixerFactory.addBuilder(new ObsVideoMixerBuilder(core.cameraFactory));
  await core.mixerFactory.addBuilder(new VMixBuilder(core.cameraFactory));
  await core.mixerFactory.addBuilder(new PassthroughBuilder());

  await core.gamepadFactory.addBuilder(
    new BrowserGamepadBuilder(core.cameraFactory, core.mixerFactory, core.notificationApi),
  );
  await core.gamepadFactory.addBuilder(
    new NodeGamepadBuilder(core.cameraFactory, core.mixerFactory, core.notificationApi),
  );

  const settingsApi = new SettingsApi();
  const logsApi = new LogsApi();

  setupElectronApi([
    core.gamepadConfigApi,
    core.connectedGamepadApi,
    core.cameraApi,
    core.videoMixerApi,
    core.notificationApi,
    settingsApi,
    logsApi,
  ]);

  core.bootstrap();
}
