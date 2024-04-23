import { z } from 'zod';
import { VideoMixerType } from './VideoMixerType';
import { IDisposable } from '@core/GenericFactory/IDisposable';

export const baseVideoMixerSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type BaseVideoMixerConfig = z.infer<typeof baseVideoMixerSchema>;

export type MixerSource = {
  id: string;
  name: string;
};

export interface IVideoMixer extends IDisposable {
  readonly name: VideoMixerType;
  readonly label: string;

  readonly isConnected: boolean;

  connect(config: Record<string, any>): void;

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

  getSources(): Promise<MixerSource[]>;
  getPreview(): Promise<MixerSource | null>;
  getOnAir(): Promise<MixerSource | null>;

  getPreviewSources(): Promise<MixerSource[]>;
  getOnAirSources(): Promise<MixerSource[]>;
}
