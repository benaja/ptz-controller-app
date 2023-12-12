import { AxisEventPayload, ButtonEventPayload, Gamepad } from '@/api/gamepadApi';
import { CgfPtzCameraState } from '@/core/CameraConnection/CgfPtzCamera/CgfPtzCameraState';
import { clients } from '@/websocket';
import { throttle } from '../utils/throttle';
import { IAxisAction, IButtonAction } from './actions/BaseAction';
import { PanCameraAction } from './actions/PanCameraAction';
import { TiltCameraAction } from './actions/TiltCameraAction';
import { ZoomCameraAction } from './actions/ZoomCameraAction';
import { FocusCameraAction } from './actions/FocusCameraAction';
import { ToggleAutofocusAction } from './actions/ToggleAutofocusAction';
import { ToggleTallyAction } from './actions/ToggleTallyAction';
import { CutInputAction } from './actions/CutInputAction';
import { NextInputAction } from './actions/NextInputAction';
import { PreviousInputAction } from './actions/PreviousInputAction';

export class GamepadController {
  private gamepad: Gamepad;
  public selectedCamera = 1;
  private currentState = new CgfPtzCameraState();
  private keyBindings: Record<string, number>;

  private axisActions: IAxisAction[];
  private buttonActions: IButtonAction[];

  constructor(gamepad: Gamepad, keyBindings: Record<string, number>) {
    this.gamepad = gamepad;
    this.keyBindings = keyBindings;

    this.axisActions = [
      new PanCameraAction(),
      new TiltCameraAction(),
      new ZoomCameraAction(),
      // new FocusCameraAction(this.currentState),
    ];

    this.buttonActions = [
      new ToggleAutofocusAction(),
      new ToggleTallyAction(),
      new CutInputAction(),
      new NextInputAction(),
      new PreviousInputAction(),
    ];
  }

  onAxis(axis: AxisEventPayload) {
    this.axisActions.forEach((action) => {
      if (this.keyBindings[action.constructor.name] === axis.axis) {
        action.hanlde(axis.value);
      }
    });
    this.sendUpdate();
  }

  onButton(button: ButtonEventPayload) {
    console.log('onButton', button.button);
    this.buttonActions.forEach((action) => {
      if (this.keyBindings[action.constructor.name] === button.button) {
        action.hanlde(button.pressed ? 'pressed' : 'released');
      }
    });
  }

  sendUpdate = throttle(() => {
    const client = clients.get(this.selectedCamera);
    if (!client) return;

    console.log('sendUpdate', this.currentState);
    client.send(JSON.stringify(this.currentState));
  }, 10);

  destroy() {}
}
