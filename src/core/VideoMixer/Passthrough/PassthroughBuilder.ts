import { IBuilder } from '@core/GenericFactory/IBuilder';
import { IVideoMixer } from '../IVideoMixer';
import { Passthrough, PassthroughMixerConfig, passthroughMixerConfigSchema } from './Passthrough';
import { VideoMixerType } from '../VideoMixerType';

export class PassthroughBuilder implements IBuilder<IVideoMixer> {
  public supportedTypes() {
    return [VideoMixerType.Passthrough];
  }

  public validationSchema() {
    return passthroughMixerConfigSchema;
  }

  public async build(config: PassthroughMixerConfig): Promise<IVideoMixer> {
    const mixer = new Passthrough(config);
    return mixer;
  }
}
