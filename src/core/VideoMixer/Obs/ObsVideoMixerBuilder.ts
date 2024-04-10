import { IBuilder } from '@core/GenericFactory/IBuilder';
import { IVideoMixer } from '../IVideoMixer';
import { ObsMixer, ObsMixerConfig, obsMixerConfigSchema } from './ObsMixer';
import { VideoMixerType } from '../VideoMixerType';
import { CameraFactory } from '@core/CameraConnection/CameraFactory';

export class ObsVideoMixerBuilder implements IBuilder<IVideoMixer> {
  constructor(private _cameraFactory: CameraFactory) {}

  public supportedTypes() {
    return [VideoMixerType.OBS];
  }

  public validationSchema() {
    return obsMixerConfigSchema;
  }

  public async build(config: ObsMixerConfig): Promise<IVideoMixer> {
    switch (config.type) {
      case VideoMixerType.OBS:
        return new ObsMixer(config, this._cameraFactory);
      default:
        throw new Error(`Video mixer type ${config.type} not supported`);
    }
  }
}
