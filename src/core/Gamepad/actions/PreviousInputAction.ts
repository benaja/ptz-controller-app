import { useVideoMixHanlder } from '@main/VideoMixer/VideoMixHanlder';
import { IButtonAction } from './BaseAction';

export class PreviousInputAction implements IButtonAction {
  hanlde(value: 'pressed' | 'released'): void {
    if (value === 'released') return;

    const mixer = useVideoMixHanlder().currentMixer();
    if (!mixer) return;

    mixer.previousInput();
  }
}
