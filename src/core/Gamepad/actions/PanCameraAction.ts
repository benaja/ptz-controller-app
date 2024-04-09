import { ICameraConnection } from '@core/CameraConnection/ICameraConnection';
import { AxisAction } from './BaseAction';

export class PanCameraAction extends AxisAction {
  constructor(private getPreviewCamera: () => ICameraConnection) {
    super();
  }

  hanlde(value: number): void {
    const calculatedValue = this.convertValue(value);
    if (!this.hasChanged(calculatedValue)) return;

    this.getPreviewCamera()?.pan(calculatedValue);
  }
}
