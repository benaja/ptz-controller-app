import { Core } from '@core/index';
import { setupElectronApi } from './electronApi/setupElectronApi';
import { CameraApi } from '@core/api/cameraApi';

export function setupApp() {
  const core = new Core();

  setupElectronApi([new CameraApi(core.cameraFactory, core.userConfigStore)]);

  core.bootstrap();
}
