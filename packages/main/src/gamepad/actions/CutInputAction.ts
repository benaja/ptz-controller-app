import { useVideoMixHanlder } from '@/VideoMixer/VideoMixHanlder';
import { IButtonAction } from './BaseAction';

export class CutInputAction implements IButtonAction {
  hanlde(value: 'pressed' | 'released'): void {
    console.log('CutInputAction', value);
    if (value === 'released') return;

    const mixer = useVideoMixHanlder().currentMixer();
    if (!mixer) return;

    mixer.cut();
  }
}
