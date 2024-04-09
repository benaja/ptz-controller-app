import { AxisAction } from './BaseAction';

export class PanCameraAction extends AxisAction {
  async hanlde(value: number) {
    const calculatedValue = this.convertValue(value);
    if (!this.hasChanged(calculatedValue)) return;

    const camera = await this.getSelectedCamera();
    camera?.pan(calculatedValue);
  }
}
