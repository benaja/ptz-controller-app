import { IBuilder } from '@core/GenericFactory/IBuilder';
import { z } from 'zod';
import { IVideoMixer } from './IVideoMixer';
import { ObsMixer, obsMixerConfigSchema } from './Obs/ObsMixer';
import { Atem, atemMixerConfigSchema } from './Blackmagicdesign/Atem';
import { VideoMixerType } from './VideoMixerType';

export const cameraConfigSchema = z.union([obsMixerConfigSchema, atemMixerConfigSchema]);

export type VideoMixerConfig = z.infer<typeof cameraConfigSchema>;

export class VideoMixerBuilder implements IBuilder<IVideoMixer> {
  public async supportedTypes(): Promise<string[]> {
    return [];
  }

  public async build(config: VideoMixerConfig): Promise<IVideoMixer> {
    switch (config.type) {
      case VideoMixerType.OBS:
        return new ObsMixer(config);
      case VideoMixerType.BlackmagicAtem:
        return new Atem(config);
    }
  }
}
