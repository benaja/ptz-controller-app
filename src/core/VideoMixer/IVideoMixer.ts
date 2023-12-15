import { VideoMixerConfig } from '@core/store/userStore';
import { z } from 'zod';
import { VideoMixerType } from './VideoMixerType';
import { IDisposable } from '@core/GenericFactory/IDisposable';

export const baseVideoMixerSchema = z.object({
  id: z.string(),
  name: z.string(),
  ip: z.string(),
  type: z.nativeEnum(VideoMixerType),
});

export type BaseVideoMixerConfig = z.infer<typeof baseVideoMixerSchema>;

export interface IVideoMixer extends IDisposable {
  readonly name: VideoMixerType;
  readonly label: string;

  connect(config: VideoMixerConfig): void;

  /**
   * Get the index of the scene that is on preview, starting from 1
   */
  getPreview(): number;
  /**
   * Get the index of the scene that is on air, starting from 1
   */
  getOnAir(): number;

  cut(): void;
  changeInput(input: number): Promise<void>;
  nextInput(): Promise<void>;
  previousInput(): Promise<void>;

  toggleKey(key: number): void;
  runMacro(macro: number): void;
  /**
   * This function allows to get whether the key is set or not
   * @param key The key which's state is requested
   */
  isKeySet(key: number): Promise<boolean>;

  /**
   * Get the current selected output for the given auxilary output
   * @param aux The aux output which's selected source is of interest
   */
  getAuxilarySelection(aux: number): Promise<number>;
}
