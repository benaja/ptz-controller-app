import { IBuilder } from '@core/GenericFactory/IBuilder';
import { IVideoMixer } from '../IVideoMixer';
import { VideoMixerType } from '../VideoMixerType';
import { Atem, AtemMixerConfig, atemMixerConfigSchema } from './Atem';
import { AtemFactory } from './AtemFactory';

export class ObsVideoMixerBuilder implements IBuilder<IVideoMixer> {
  public supportedTypes() {
    return [VideoMixerType.BlackmagicAtem];
  }

  public validationSchema() {
    return atemMixerConfigSchema;
  }

  public async build(config: AtemMixerConfig): Promise<IVideoMixer> {
    switch (config.type) {
      case VideoMixerType.BlackmagicAtem:
        return new Atem(config, new AtemFactory());
      default:
        throw new Error(`Video mixer type ${config.type} not supported`);
    }
  }
}
