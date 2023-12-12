import { getCurrentCameraConnection } from '@/core/CameraConnection/CameraConnectionHandler';
import { AxisAction } from './BaseAction';

export class ZoomCameraAction extends AxisAction {
  hanlde(value: number): void {
    getCurrentCameraConnection()?.zoom(-Math.round(value * 8));
  }
}
