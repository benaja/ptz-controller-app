import { IAxisAction } from './BaseAction';

export class FocusCameraAction implements IAxisAction {
  hanlde(value: number): void {
    console.log('FocusCameraAction', value);
    // this.state.focus = -Math.round(value * 8);
  }
}
