import { ICameraConnection } from '@core/CameraConnection/ICameraConnection';
import { IButtonAction } from './BaseAction';

export class ToggleTallyAction implements IButtonAction {
  constructor(private getPreviewCamera: () => ICameraConnection) {}

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

    console.log('ToggleTallyAction', this.state);

    this.getPreviewCamera()?.setTally(this.state);
  }
}
