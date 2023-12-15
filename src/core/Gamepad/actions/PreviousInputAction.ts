import { IButtonAction } from './BaseAction';
import { IVideoMixer } from '@core/VideoMixer/IVideoMixer';

export class PreviousInputAction implements IButtonAction {
  constructor(private videoMixer: () => IVideoMixer) {}

  hanlde(value: 'pressed' | 'released'): void {
    if (value === 'released') return;

    this.videoMixer().previousInput();
  }
}
