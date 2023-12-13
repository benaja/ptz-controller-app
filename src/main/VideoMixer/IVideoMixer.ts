import { VideoMixerConfig } from '@main/store/userStore';

export interface IVideoMixer {
  readonly name: string;
  readonly label: string;

  connect(config: VideoMixerConfig): void;
  disconnect(): void;

  /**
   * Get the index of the scene that is on preview, starting from 0
   */
  getPreview(): number;
  /**
   * Get the index of the scene that is on air, starting from 0
   */
  getOnAir(): number;

  cut(): void;
  changeInput(input: number): Promise<void>;
  nextInput(): Promise<void>;
  previousInput(): Promise<void>;
}
