import { setupApi } from '@/electronApi/setupElectronApi';
import { useCameraConnectionHandler } from './CameraConnection/CameraConnectionHandler';
import { GamepadApi } from '@core/api/gamepadApi';
import { CameraApi } from '@core/api/cameraApi';
import { VideoMixerApi } from '@core/api/videoMixerApi';
import { IDisposable } from './GenericFactory/IDisposable';
import { CameraConnectionFactory } from './CameraConnection/CameraConnectionFactory';
import { setupGamepads } from './Gamepad/setupGamepads';
import { UserConfigStore } from './store/userStore';
import { CameraConnectionBuilder } from './CameraConnection/CameraConnectionBuilder';
import { VideomixerFactory } from './VideoMixer/VideoMixerFactory';
import { VideoMixerBuilder } from './VideoMixer/VideoMixerBuilder';
// import { default as OBSWebSocket } from 'obs-websocket-js';
// import default from '../../../../tailwind.config';
// const OBSWebSocket = require('obs-websocket-js').default;

export async function setupCore() {
  console.log('setupCore');
  // const core = new Core();
  // await core.cameraFactory.builderAdd(new CgfPtzCameraBuilder());
  // core.bootstrap();
  // setupVideoMixHandler([new ObsMixer()]);
  // setupCameraConnectionHandler();
  // console.log('websocket', websocket);
  // websocket.connect({ address: 'localhost:4444' });
  // setupApi([new GamepadApi(), new CameraApi(), new VideoMixerApi()]);
  // setupGamepads();
}

export function teardownCore() {
  useCameraConnectionHandler()?.dispose();
}

export class Core implements IDisposable {
  private _camFactory: CameraConnectionFactory;
  private _mixerFactory: VideomixerFactory;
  private _gamepadFactory: G;

  private _userConfigStore = new UserConfigStore();

  public get cameraFactory(): CameraConnectionFactory {
    return this._camFactory;
  }

  public get userConfigStore(): UserConfigStore {
    return this._userConfigStore;
  }

  constructor() {
    this._camFactory = new CameraConnectionFactory(new CameraConnectionBuilder());
    this._mixerFactory = new VideomixerFactory(new VideoMixerBuilder());
    console.log('Core constructor');
  }

  // public get mixerFactory(): VideomixerFactory {
  //   return this._mixerFactory;
  // }

  // public get hmiFactory(): HmiFactory {
  //   return this._hmiFactory;
  // }

  public async bootstrap(): Promise<void> {
    // for (const cam of validConfig.cams) {
    //   await this._camFactory.parseConfig(cam, logger);
    // }
    // for (const videoMixer of validConfig.videoMixers) {
    //   await this._mixerFactory.parseConfig(videoMixer, logger);
    // }
    // for (const hmi of validConfig.interfaces) {
    //   await this._hmiFactory.parseConfig(hmi, logger);
    // }
  }

  public async dispose(): Promise<void> {
    // await this._camFactory.dispose();
    // await this._mixerFactory.dispose();
    // await this._hmiFactory.dispose();
  }

  private error(logger: ILogger, error: string): void {
    logger.error(`Core: ${error}`);
  }
}
