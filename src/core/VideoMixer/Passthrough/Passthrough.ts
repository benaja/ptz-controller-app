import { IVideoMixer, MixerSource, baseVideoMixerSchema } from '../IVideoMixer';
import { z } from 'zod';
import { VideoMixerType } from '../VideoMixerType';

export const passthroughMixerConfigSchema = baseVideoMixerSchema.extend({
  type: z.literal(VideoMixerType.Passthrough),
});

export type PassthroughMixerConfig = z.infer<typeof passthroughMixerConfigSchema>;

export class Passthrough implements IVideoMixer {
  readonly name: VideoMixerType = VideoMixerType.Passthrough;
  readonly label: string = 'Passthrough';

  readonly isConnected: boolean = true;

  private _currentOnAir = 0;
  private _currentPreview = 1;

  constructor(private _config: PassthroughMixerConfig) {}

  public get connectionString(): string {
    return 'passthrough';
  }

  connect(config: Record<string, any>) {
    return;
  }

  cut(): void {
    const onAir = this._currentOnAir;
    this._currentOnAir = this._currentPreview;
    this._currentPreview = onAir;
  }
  changeInput(input: number): Promise<void> {
    return Promise.resolve();
  }
  nextInput(): Promise<void> {
    return Promise.resolve();
  }
  previousInput(): Promise<void> {
    return Promise.resolve();
  }

  toggleKey(key: number): void {}
  runMacro(macro: number): void {}
  /**
   * This function allows to get whether the key is set or not
   * @param key The key which's state is requested
   */
  isKeySet(key: number): Promise<boolean> {
    return Promise.resolve(false);
  }

  /**
   * Get the current selected output for the given auxilary output
   * @param aux The aux output which's selected source is of interest
   */
  getAuxilarySelection(aux: number): Promise<number> {
    return Promise.resolve(0);
  }

  async getSources(): Promise<MixerSource[]> {
    return [
      { id: '0', name: 'Passthrough 1' },
      { id: '1', name: 'Passthrough 2' },
      { id: '2', name: 'Passthrough 3' },
      { id: '3', name: 'Passthrough 4' },
    ];
  }
  async getPreview(): Promise<MixerSource | null> {
    const sources = await this.getSources();
    return sources[this._currentPreview];
  }
  async getOnAir(): Promise<MixerSource | null> {
    const sources = await this.getSources();
    return sources[this._currentOnAir];
  }

  async getPreviewSources(): Promise<MixerSource[]> {
    const preview = await this.getPreview();
    return preview ? [preview] : [];
  }

  async getOnAirSources(): Promise<MixerSource[]> {
    const onAir = await this.getOnAir();
    return onAir ? [onAir] : [];
  }

  dispose(): void {}
}
