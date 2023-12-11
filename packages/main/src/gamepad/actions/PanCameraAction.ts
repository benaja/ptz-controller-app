import { CgfPtzCameraState } from '@/core/CameraConnection/CgfPtzCamera/CgfPtzCameraState';
import { IAxisAction } from './BaseAction';

export class PanCameraAction implements IAxisAction {
  state: CgfPtzCameraState;

  constructor(state: CgfPtzCameraState) {
    this.state = state;
  }

  hanlde(value: number): void {
    this.state.pan = Math.round(value * 255);
  }
}
