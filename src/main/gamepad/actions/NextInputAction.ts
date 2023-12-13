import { useVideoMixHanlder } from '@main/VideoMixer/VideoMixHanlder';
import { IButtonAction } from './BaseAction';

export class NextInputAction implements IButtonAction {
  hanlde(value: 'pressed' | 'released'): void {
    if (value === 'released') return;

    const mixer = useVideoMixHanlder().currentMixer();
    if (!mixer) return;

    console.log('nextINput');

    mixer.nextInput();
  }
}
