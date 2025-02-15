import { GamepadFactory } from '@core/Gamepad/GemepadFactory';
import { GamepadRepository } from '@core/repositories/GamepadRepository';
import { ConnectedGamepadStore } from '@core/store/ConnectedGamepadsStore';

export type ConnectedGamepad = {
  id: string;
  name: string;
};

export type ConnectedGamepadResponse = {
  inUse: boolean;
} & ConnectedGamepad;

export type ButtonEventPayload = {
  button: number;
  pressed: boolean;
  value: number;
  gamepad: ConnectedGamepad;
};

export type AxisEventPayload = {
  axis: number;
  value: number;
  gamepad: ConnectedGamepad;
};

export class ConnectedGamepadApi {
  public constructor(
    private _gamepadFactory: GamepadFactory,
    private _connectedGamepadsStore: ConnectedGamepadStore,
    private _gamepadRepository: GamepadRepository,
  ) {}

  public getConnectedGamepads(): ConnectedGamepadResponse[] {
    return this._connectedGamepadsStore.get().map((c) => ({
      ...c,
      inUse: !!this._gamepadFactory.getByGamepadId(c.id),
    }));
  }

  public gamepadConnected(gamepad: ConnectedGamepad): void {
    console.log('camepadConnected', gamepad);
    if (this._connectedGamepadsStore.get().find((g) => g.id === gamepad.id)) {
      return;
    }
    this._connectedGamepadsStore.get().push(gamepad);

    const gamepadController = this._gamepadFactory.getByGamepadId(gamepad.id);
    if (!gamepadController) return;

    gamepadController.isConnected = true;
  }

  public gamepadDisconnected(gamepad: ConnectedGamepad): void {
    const index = this._connectedGamepadsStore.get().findIndex((c) => c.id === gamepad.id);
    if (index === -1) return;
    this._connectedGamepadsStore.get().splice(index, 1);

    const gamepadController = this._gamepadFactory.getByGamepadId(gamepad.id);
    if (!gamepadController) return;

    gamepadController.isConnected = false;
  }

  public updateConnectedGamepads(gamepads: ConnectedGamepad[]): void {
    const originalGamepads = [...this._connectedGamepadsStore.get()];
    const addedGamepads = gamepads.filter(
      (gamepad) => !originalGamepads.find((originalGamepad) => originalGamepad.id === gamepad.id),
    );
    const removedGamepads = originalGamepads.filter(
      (gamepad) => !gamepads.find((connectedGamepad) => connectedGamepad.id === gamepad.id),
    );
    addedGamepads.forEach((gamepad) => {
      this.gamepadConnected(gamepad);
    });
    removedGamepads.forEach((gamepad) => {
      this.gamepadDisconnected(gamepad);
    });
  }

  public triggerButtonEvent(event: ButtonEventPayload) {
    const gamepad = this._gamepadFactory.getByGamepadId(event.gamepad.id);
    if (!gamepad) return;

    gamepad.onButton(event);
  }

  public triggerAxisEvent(event: AxisEventPayload) {
    const gamepad = this._gamepadFactory.getByGamepadId(event.gamepad.id);
    if (!gamepad) return;

    gamepad.onAxis(event);
  }
}
