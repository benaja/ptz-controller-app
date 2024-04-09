import { AxisAction } from './BaseAction';

export class ZoomCameraAction extends AxisAction {
  async hanlde(value: number) {
    const calculatedValue = this.convertValue(value, 8);
    if (!this.hasChanged(calculatedValue)) return;

    console.log('ZoomCameraAction', calculatedValue);
    const camera = await this.getSelectedCamera();
    camera?.zoom(-calculatedValue);
  }
}
