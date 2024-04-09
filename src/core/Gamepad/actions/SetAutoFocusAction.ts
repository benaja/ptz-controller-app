import { ICameraConnection } from '@core/CameraConnection/ICameraConnection';
import { IButtonAction } from './BaseAction';

export class SetAutoFocusAction implements IButtonAction {
  constructor(private getPreviewCamera: () => ICameraConnection) {}

  private lastState = false;

  hanlde(value: 'pressed' | 'released'): void {
    if (value === 'released') return;

    this.lastState = !this.lastState;

    this.getPreviewCamera()?.setAutoFocus(this.lastState);
    // this.getPreviewCamera()?.toggleAutoFocus();
  }
}
