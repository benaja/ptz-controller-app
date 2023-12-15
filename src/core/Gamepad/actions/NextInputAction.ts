import { IVideoMixer } from '@core/VideoMixer/IVideoMixer';
import { IButtonAction } from './BaseAction';

export class NextInputAction implements IButtonAction {
  constructor(private videoMixer: () => IVideoMixer) {}

  hanlde(value: 'pressed' | 'released'): void {
    if (value === 'released') return;

    console.log('NextInputAction');

    // const mixer = useVideoMixHanlder().currentMixer();
    // if (!mixer) return;

    // console.log('nextINput');

    this.videoMixer().nextInput();
  }
}
