import { ButtonAction } from './BaseAction';

export class GetCurrentPositionAction extends ButtonAction {
  private savedPosition = { pan: 0, tilt: 0, zoom: 0 };

  async hanlde(value: 'pressed' | 'released') {
    const previewCamera = await this.getPreviewCamera();
    if (!previewCamera) return;

    if (value === 'pressed') {
      this.timePresssed = Date.now();
      return;
    }

    // check if pressed for more than 1 second
    if (Date.now() - this.timePresssed > 1000) {
      this.savedPosition = await previewCamera.getPosition();
      console.log('Saved position', this.savedPosition);
      return;
    }

    previewCamera.goToPosition({
      pan: this.savedPosition.pan,
      tilt: this.savedPosition.tilt,
      speed: 255,
    });
  }
}
