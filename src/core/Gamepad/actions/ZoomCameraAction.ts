import { ICameraConnection } from '@core/CameraConnection/ICameraConnection';
import { AxisAction } from './BaseAction';

export class ZoomCameraAction extends AxisAction {
  constructor(private getPreviewCamera: () => ICameraConnection) {
    super();
  }

  hanlde(value: number): void {
    console.log('ZoomCameraAction', value);
    this.getPreviewCamera()?.zoom(-Math.round(value * 8));
  }
}
