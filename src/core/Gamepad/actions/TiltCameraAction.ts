import { AxisAction } from './BaseAction';

export class TiltCameraAction extends AxisAction {
  hanlde(value: number): void {
    console.log('TiltCameraAction', value);
    // getCurrentCameraConnection()?.tilt(-Math.round(value * 255));
  }
}
