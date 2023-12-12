import { getCurrentCameraConnection } from '@/core/CameraConnection/CameraConnectionHandler';
import { AxisAction } from './BaseAction';

export class PanCameraAction extends AxisAction {
  hanlde(value: number): void {
    getCurrentCameraConnection()?.pan(Math.round(value * 255));
  }
}
