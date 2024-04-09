import { AxisAction } from './BaseAction';

export class TiltCameraAction extends AxisAction {
  async hanlde(value: number) {
    const calculatedValue = this.convertValue(value);
    if (!this.hasChanged(calculatedValue)) return;

    console.log('TiltCamera', calculatedValue);
    const camera = await this.getSelectedCamera();
    camera?.tilt(calculatedValue === 0 ? 0 : -calculatedValue);
  }
}
