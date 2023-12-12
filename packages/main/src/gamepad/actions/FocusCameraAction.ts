import { CgfPtzCameraState } from '@/core/CameraConnection/CgfPtzCamera/CgfPtzCameraState';
import { IAxisAction } from './BaseAction';

export class FocusCameraAction implements IAxisAction {
  state: CgfPtzCameraState;

  constructor(state: CgfPtzCameraState) {
    this.state = state;
  }

  hanlde(value: number): void {
    this.state.focus = -Math.round(value * 8);
  }
}
