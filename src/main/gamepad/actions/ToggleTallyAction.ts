import { getCurrentCameraConnection } from '@main/core/CameraConnection/CameraConnectionHandler';
import { IButtonAction } from './BaseAction';

export class ToggleTallyAction implements IButtonAction {
  state: 'preview' | 'live' | '' = '';

  hanlde(value: 'pressed' | 'released'): void {
    if (value === 'released') return;
    if (this.state === 'preview') {
      this.state = 'live';
    } else if (this.state === 'live') {
      this.state = '';
    } else {
      this.state = 'preview';
    }

    getCurrentCameraConnection()?.setTally(this.state);
  }
}
