import { IButtonAction } from './BaseAction';
import { getCurrentCameraConnection } from '@core/CameraConnection/CameraConnectionHandler';

export class ToggleAutofocusAction implements IButtonAction {
  hanlde(value: 'pressed' | 'released'): void {
    if (value === 'released') return;

    getCurrentCameraConnection()?.toggleAutoFocus();
  }
}
