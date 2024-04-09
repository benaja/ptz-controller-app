import { ICameraConnection } from '@core/CameraConnection/ICameraConnection';
import { AxisAction } from './BaseAction';

export class TiltCameraAction extends AxisAction {
  constructor(private getPreviewCamera: () => ICameraConnection) {
    super();
  }

  hanlde(value: number): void {
    const calculatedValue = this.convertValue(value);
    if (!this.hasChanged(calculatedValue)) return;

    this.getPreviewCamera()?.tilt(calculatedValue === 0 ? 0 : -calculatedValue);
  }
}
