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
import { IDisposable } from './GenericFactory/IDisposable';
import { CameraConnectionFactory } from './CameraConnection/CameraConnectionFactory';
import { CgfPtzCameraBuilder } from './CameraConnection/CgfPtzCamera/CgfPtzCameraBuilder';
// import { default as OBSWebSocket } from 'obs-websocket-js';
// import default from '../../../../tailwind.config';
// const OBSWebSocket = require('obs-websocket-js').default;

export async function setupCore() {
  const core = new Core();
  await core.cameraFactory.builderAdd(new CgfPtzCameraBuilder());
  core.bootstrap();
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

export class Core implements IDisposable {
  private _camFactory = new CameraConnectionFactory();
  // private _mixerFactory = new VideomixerFactory();
  // private _hmiFactory = new HmiFactory();

  public get cameraFactory(): CameraConnectionFactory {
    return this._camFactory;
  }

  // public get mixerFactory(): VideomixerFactory {
  //   return this._mixerFactory;
  // }

  // public get hmiFactory(): HmiFactory {
  //   return this._hmiFactory;
  // }

  public async bootstrap(): Promise<void> {
    for (const cam of validConfig.cams) {
      await this._camFactory.parseConfig(cam, logger);
    }

    for (const videoMixer of validConfig.videoMixers) {
      await this._mixerFactory.parseConfig(videoMixer, logger);
    }

    for (const hmi of validConfig.interfaces) {
      await this._hmiFactory.parseConfig(hmi, logger);
    }
  }

  public async dispose(): Promise<void> {
    await this._camFactory.dispose();
    await this._mixerFactory.dispose();
    await this._hmiFactory.dispose();
  }

  private error(logger: ILogger, error: string): void {
    logger.error(`Core: ${error}`);
  }
}
