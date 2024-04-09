import { ICameraConnection } from '@core/CameraConnection/ICameraConnection';
import { AxisAction } from './BaseAction';

export class ZoomCameraAction extends AxisAction {
  constructor(private getPreviewCamera: () => ICameraConnection) {
    super();
  }

  hanlde(value: number): void {
    const calculatedValue = this.convertValue(value, 8);
    if (!this.hasChanged(calculatedValue)) return;

    console.log('ZoomCameraAction', value);
    this.getPreviewCamera()?.zoom(-Math.round(value * 8));
  }
}
