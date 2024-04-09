import { IGamepadController } from '@core/Gamepad/IGamepadController';
import { GamepadConfig } from './BrowserGamepadBuilder';
import { GamepadController } from '@core/Gamepad/GamepadController';

export class BrowserGamepad extends GamepadController implements IGamepadController {
  isConnected: b;
}
