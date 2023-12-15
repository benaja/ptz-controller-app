import { ICameraConnection } from '@core/CameraConnection/ICameraConnection';
import { IButtonAction } from './BaseAction';

export class ToggleAutofocusAction implements IButtonAction {
  constructor(private getPreviewCamera: () => ICameraConnection) {}

  hanlde(value: 'pressed' | 'released'): void {
    if (value === 'released') return;

    console.log('ToggleAutofocusAction');

    this.getPreviewCamera()?.toggleAutoFocus();
  }
}
