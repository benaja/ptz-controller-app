import { IVideoMixer } from '@core/VideoMixer/IVideoMixer';
import { IButtonAction } from './BaseAction';
import { ICameraConnection } from '@core/CameraConnection/ICameraConnection';

export class GetCurrentPositionAction implements IButtonAction {
  constructor(private getPreviewCamera: () => ICameraConnection) {}

  private timePresssed = 0;
  private savedPosition = { pan: 0, tilt: 0, z: 0 };

  hanlde(value: 'pressed' | 'released'): void {
    if (value === 'pressed') {
      this.timePresssed = Date.now();
      return;
    }

    // check if pressed for more than 1 second
    if (Date.now() - this.timePresssed < 1000) {
      this.getPreviewCamera().getPosition();
    }

    console.log('CutInputAction', value);
    if (value === 'released') return;

    if (!this.getPreviewCamera()) return;

    this.getPreviewCamera().getPosition();
  }
}
