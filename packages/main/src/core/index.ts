import * as ConfigSchema from './Configuration/IConfigurationStructure.json';

import { CameraConnectionFactory } from './CameraConnection/CameraConnectionFactory';
import { CgfPtzCameraBuilder } from './CameraConnection/CgfPtzCamera/CgfPtzCameraBuilder';
import { ConfigValidator } from './Configuration/ConfigValidator';
import { HmiFactory } from './Hmi/HmiFactory';
import { IBuilder } from './GenericFactory/IBuilder';
import { ICameraConnection } from './CameraConnection/ICameraConnection';
import { IConfig } from './Configuration/IConfig';
import { IConfigurationStructure } from './Configuration/IConfigurationStructure';
import { IConnection } from './GenericFactory/IConnection';
import { IDisposable } from './GenericFactory/IDisposable';
import { IHmi } from './Hmi/IHmi';
import { IImageSelectionChange } from './VideoMixer/IImageSelectionChange';
import { ILogger } from './Logger/ILogger';
import { ISubscription } from './GenericFactory/ISubscription';
import { IVideoMixer } from './VideoMixer/IVideoMixer';
import { VideomixerFactory } from './VideoMixer/VideoMixerFactory';
import { userConfigStore } from '@main/store';

export class Core implements IDisposable {
  private _camFactory = new CameraConnectionFactory();
  private _mixerFactory = new VideomixerFactory();
  private _hmiFactory = new HmiFactory();

  public get cameraFactory(): CameraConnectionFactory {
    return this._camFactory;
  }

  public get mixerFactory(): VideomixerFactory {
    return this._mixerFactory;
  }

  public get hmiFactory(): HmiFactory {
    return this._hmiFactory;
  }

  public async bootstrap(config: unknown): Promise<void> {
    // const configValidator = new ConfigValidator();
    // const validConfig = configValidator.validate<IConfigurationStructure>(config, ConfigSchema);
    // if (validConfig === undefined) {
    //   this.error('Failed to load configuration');
    //   this.error(configValidator.errorGet());
    //   return;
    // }

    await this._camFactory.builderAdd(new CgfPtzCameraBuilder());

    const cams = userConfigStore.get('cams');
    for (const cam of cams) {
      await this._camFactory.parseConfig(cam);
    }

    for (const videoMixer of validConfig.videoMixers) {
      await this._mixerFactory.parseConfig(videoMixer);
    }

    for (const hmi of validConfig.interfaces) {
      await this._hmiFactory.parseConfig(hmi);
    }
  }

  public async dispose(): Promise<void> {
    await this._camFactory.dispose();
    await this._mixerFactory.dispose();
    await this._hmiFactory.dispose();
  }

  private error(error: string): void {
    console.error(`Core: ${error}`);
  }
}

export type { IConfig };
export type { IHmi };
export type { IBuilder };
export type { ILogger };
export { VideomixerFactory };
export { CameraConnectionFactory };
export type { IConnection };
export type { IVideoMixer };
export type { IImageSelectionChange };
export type { ICameraConnection };
export type { ISubscription };
