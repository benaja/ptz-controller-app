import { IVideoMixer } from '@core/VideoMixer/IVideoMixer';
import { IButtonAction } from './BaseAction';

export class CutInputAction implements IButtonAction {
  constructor(private videoMixer: () => IVideoMixer) {}

  hanlde(value: 'pressed' | 'released'): void {
    console.log('CutInputAction', value);
    if (value === 'released') return;

    if (!this.videoMixer()) return;

    this.videoMixer().cut();
  }
}
