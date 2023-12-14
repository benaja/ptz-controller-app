import { AxisAction } from './BaseAction';

export class TiltCameraAction extends AxisAction {
  hanlde(value: number): void {
    getCurrentCameraConnection()?.tilt(-Math.round(value * 255));
  }
}