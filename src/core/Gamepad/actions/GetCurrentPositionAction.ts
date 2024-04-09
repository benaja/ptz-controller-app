import { IVideoMixer } from '@core/VideoMixer/IVideoMixer';
import { IButtonAction } from './BaseAction';
import { ICameraConnection } from '@core/CameraConnection/ICameraConnection';

export class GetCurrentPositionAction implements IButtonAction {
  constructor(private getPreviewCamera: () => ICameraConnection) {}

  private timePresssed = 0;
  private savedPosition = { pan: 0, tilt: 0, zoom: 0 };

  async hanlde(value: 'pressed' | 'released'): void {
    if (!this.getPreviewCamera()) return;

    if (value === 'pressed') {
      this.timePresssed = Date.now();
      return;
    }

    // check if pressed for more than 1 second
    if (Date.now() - this.timePresssed > 1000) {
      this.savedPosition = await this.getPreviewCamera().getPosition();
      console.log('Saved position', this.savedPosition);
      return;
    }

    this.getPreviewCamera().goToPosition({
      pan: this.savedPosition.pan,
      tilt: this.savedPosition.tilt,
      speed: 255,
    });
  }
}
