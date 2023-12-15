import { ICameraConnection } from '@core/CameraConnection/ICameraConnection';
import { AxisAction } from './BaseAction';

export class PanCameraAction extends AxisAction {
  constructor(private getPreviewCamera: () => ICameraConnection) {
    super();
  }

  hanlde(value: number): void {
    console.log('PanCameraAction', value);
    this.getPreviewCamera()?.pan(Math.round(value * 255));
  }
}
