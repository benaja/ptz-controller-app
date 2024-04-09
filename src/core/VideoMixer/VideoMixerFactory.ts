import { Store } from '@core/store';
import { Factory } from '../GenericFactory/Factory';
import { IVideoMixer } from './IVideoMixer';
import { z } from 'zod';
import { obsMixerConfigSchema } from './Obs/ObsMixer';
import { atemMixerConfigSchema } from './Blackmagicdesign/Atem';

const videomixerConfigSchema = z.union([obsMixerConfigSchema, atemMixerConfigSchema]);
export type VideoMixerConfig = z.infer<typeof videomixerConfigSchema>;
export class VideomixerFactory extends Factory<IVideoMixer> {
  public store = new Store({
    configName: 'videomixer',
    schema: z.object({
      videoMixers: z.array(videomixerConfigSchema),
    }),
    defaults: {
      videoMixers: [],
    },
  });
}
