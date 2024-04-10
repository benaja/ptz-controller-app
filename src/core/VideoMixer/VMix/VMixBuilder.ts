import { IBuilder } from '@core/GenericFactory/IBuilder';
import { IVideoMixer } from '../IVideoMixer';
import { VideoMixerType } from '../VideoMixerType';
import { Vmix, VmixConfig, vMixConfigSchema } from './Vmix';

export class VMixBuilder implements IBuilder<IVideoMixer> {
  public supportedTypes() {
    return [VideoMixerType.Vmix];
  }

  public validationSchema() {
    return vMixConfigSchema;
  }

  public async build(config: VmixConfig): Promise<IVideoMixer> {
    switch (config.type) {
      case VideoMixerType.Vmix:
        return new Vmix(config);
      default:
        throw new Error(`Video mixer type ${config.type} not supported`);
    }
  }
}
