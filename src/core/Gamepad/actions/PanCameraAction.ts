import { AxisAction } from './BaseAction';

export class PanCameraAction extends AxisAction {
  hanlde(value: number): void {
    console.log('PanCameraAction', value);
    // getCurrentCameraConnection()?.pan(Math.round(value * 255));
  }
}
