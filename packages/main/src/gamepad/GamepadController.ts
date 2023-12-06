import { AxisEventPayload, ButtonEventPayload, Gamepad } from '@/api/gamepadApi';

export class GamepadController {
  private gamepad: Gamepad;

  constructor(gamepad: Gamepad) {
    this.gamepad = gamepad;
  }

  onAxis(axis: AxisEventPayload) {
    console.log('onAxis', axis);
  }

  onButton(button: ButtonEventPayload) {
    console.log('onButton', button);
  }

  destroy() {}
}
