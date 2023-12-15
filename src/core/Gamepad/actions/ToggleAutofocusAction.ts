import { IButtonAction } from './BaseAction';

export class ToggleAutofocusAction implements IButtonAction {
  hanlde(value: 'pressed' | 'released'): void {
    if (value === 'released') return;

    console.log('ToggleAutofocusAction');

    // getCurrentCameraConnection()?.toggleAutoFocus();
  }
}
