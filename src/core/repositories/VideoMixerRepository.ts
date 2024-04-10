import { z } from 'zod';
import { Repository } from './Repository';
import { obsMixerConfigSchema } from '@core/VideoMixer/Obs/ObsMixer';
import { atemMixerConfigSchema } from '@core/VideoMixer/Blackmagicdesign/Atem';

const videomixerConfigSchema = z.discriminatedUnion('type', [
  obsMixerConfigSchema,
  atemMixerConfigSchema,
]);
export type VideoMixerConfig = z.infer<typeof videomixerConfigSchema>;

export class VideoMixerRepository extends Repository<VideoMixerConfig> {
  constructor() {
    super('videomixer', videomixerConfigSchema);
  }
}
