import { AxisEventPayload, ButtonEventPayload, Gamepad } from '@/api/gamepadApi';
import { CgfPtzCameraState } from '@/core/CameraConnection/CgfPtzCamera/CgfPtzCameraState';
import { clients } from '@/websocket';
import { throttle } from '../utils/throttle';

export class GamepadController {
  private gamepad: Gamepad;
  private selectedCamera = 0;
  private currentState = new CgfPtzCameraState();

  constructor(gamepad: Gamepad) {
    this.gamepad = gamepad;
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
