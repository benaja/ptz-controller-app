import { AxisAction } from './BaseAction';

export class ZoomCameraAction extends AxisAction {
  hanlde(value: number): void {
    console.log('ZoomCameraAction', value);
    // getCurrentCameraConnection()?.zoom(-Math.round(value * 8));
  }
}
