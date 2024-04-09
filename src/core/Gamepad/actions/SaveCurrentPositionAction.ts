import { ButtonAction } from './BaseAction';

export class GetCurrentPositionAction extends ButtonAction {
  private timePresssed = 0;
  private savedPosition = { pan: 0, tilt: 0, z: 0 };

  async hanlde(value: 'pressed' | 'released') {
    if (value === 'pressed') {
      this.timePresssed = Date.now();
      return;
    }

    const camera = await this.getSelectedCamera();
    if (!camera) return;

    // check if pressed for more than 1 second
    if (Date.now() - this.timePresssed < 1000) {
      camera.getPosition();
    }

    console.log('CutInputAction', value);
    if (value === 'released') return;

    camera.getPosition();
  }
}
