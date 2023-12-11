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

  private axisActions: IAxisAction[];

  constructor(gamepad: Gamepad) {
    this.gamepad = gamepad;

    this.axisActions = [
      new PanCameraAction(this.currentState),
      new TiltCameraAction(this.currentState),
      new ZoomCameraAction(this.currentState),
    ];
  }

  onAxis(axis: AxisEventPayload) {
    switch (axis.axis) {
      case 0:
        this.currentState.tilt = Math.round(axis.value * 255);
        break;
      case 1:
        this.currentState.pan = Math.round(axis.value * 255);
        break;
      case 3:
        this.currentState.zoom = Math.round(axis.value * 8);
        break;
    }
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
