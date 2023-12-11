import { AxisEventPayload, ButtonEventPayload, Gamepad } from '@/api/gamepadApi';
import { CgfPtzCameraState } from '@/core/CameraConnection/CgfPtzCamera/CgfPtzCameraState';
import { clients } from '@/websocket';
import { throttle } from '../utils/throttle';
import { IAxisAction } from './actions/BaseAction';
import { PanCameraAction } from './actions/PanCameraAction';
import { TiltCameraAction } from './actions/TiltCameraAction';
import { ZoomCameraAction } from './actions/ZoomCameraAction';

export class GamepadController {
  private gamepad: Gamepad;
  private selectedCamera = 0;
  private currentState = new CgfPtzCameraState();
  private keyBindings: Record<string, number>;

  private axisActions: IAxisAction[];

  constructor(gamepad: Gamepad, keyBindings: Record<string, number>) {
    this.gamepad = gamepad;
    this.keyBindings = keyBindings;

    console.log('GamepadController', this.gamepad, this.keyBindings);

    this.axisActions = [
      new PanCameraAction(this.currentState),
      new TiltCameraAction(this.currentState),
      new ZoomCameraAction(this.currentState),
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
    console.log('onButton', button);
  }

  sendUpdate = throttle(() => {
    console.log('sendUpdate', this.currentState);
    const client = clients.get(this.selectedCamera);
    if (!client) return;

    client.send(JSON.stringify(this.currentState));
  }, 10);

  destroy() {}
}
