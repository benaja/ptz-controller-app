import { ICameraConnection } from '@core/CameraConnection/ICameraConnection';
import { ButtonAction, IButtonAction } from './BaseAction';

export class ToggleAutofocusAction extends ButtonAction {
  private lastState = false;

  async hanlde(value: 'pressed' | 'released') {
    if (value === 'released') return;

    console.log('ToggleAutofocusAction');

    this.lastState = !this.lastState;

    const camera = await this.getSelectedCamera();

    camera?.setAutoFocus(this.lastState);
  }
}
