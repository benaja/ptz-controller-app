import { AxisAction } from './BaseAction';

export class FocusCameraAction extends AxisAction {
  hanlde(value: number): void {
    console.log('FocusCameraAction', value);
    // this.state.focus = -Math.round(value * 8);
  }
}
