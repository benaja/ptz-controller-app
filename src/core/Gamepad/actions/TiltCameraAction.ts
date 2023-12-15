import { ICameraConnection } from '@core/CameraConnection/ICameraConnection';
import { AxisAction } from './BaseAction';

export class TiltCameraAction extends AxisAction {
  constructor(private getPreviewCamera: () => ICameraConnection) {
    super();
  }

  hanlde(value: number): void {
    console.log('TiltCameraAction', value);
    this.getPreviewCamera()?.tilt(-Math.round(value * 255));
  }
}
