import { CgfPtzCameraState } from '@/core/CameraConnection/CgfPtzCamera/CgfPtzCameraState';
import { IAxisAction } from './BaseAction';

export class ZoomCameraAction implements IAxisAction {
  state: CgfPtzCameraState;

  constructor(state: CgfPtzCameraState) {
    this.state = state;
  }

  hanlde(value: number): void {
    this.state.zoom = Math.round(value * 8);
  }
}
