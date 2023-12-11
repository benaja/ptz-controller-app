import { CgfPtzCameraState } from '@/core/CameraConnection/CgfPtzCamera/CgfPtzCameraState';
import { IAxisAction } from './BaseAction';

export class TiltCameraAction implements IAxisAction {
  name = 'TiltCamera';
  state: CgfPtzCameraState;

  constructor(state: CgfPtzCameraState) {
    this.state = state;
  }

  hanlde(value: number): void {
    this.state.tilt = Math.round(value * 255);
  }
}
