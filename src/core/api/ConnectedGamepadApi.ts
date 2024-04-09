import { GamepadFactory } from '@core/Gamepad/GemepadFactory';
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

function mergeKeyBindings(
  defaultKeyBindings: Record<string, number>,
  customzedKeyBindings: Record<string, number>,
): Record<string, number> {
  const mergedKeyBindings = { ...defaultKeyBindings };

  Object.keys(customzedKeyBindings).forEach((key) => {
    mergedKeyBindings[key] = customzedKeyBindings[key];
  });

  return mergedKeyBindings;
}

export class ConnectedGamepadApi {
  public constructor(
    private _gamepadFactory: GamepadFactory,
    private _connectedGamepadsStore: ConnectedGamepadStore,
  ) {}

  public getConnectedGamepads(): ConnectedGamepadResponse[] {
    console.log('getConnectedGamepads', this._connectedGamepadsStore.get());
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

    const gamepads = this._gamepadFactory.store.get('gamepads');
    const availableGamepad = gamepads.find((g) => g.gamepadId === gamepad.id);

    if (!availableGamepad) return;

    this._gamepadFactory.add(availableGamepad);
  }

  public gamepadDisconnected(gamepad: ConnectedGamepad): void {
    const index = this._connectedGamepadsStore.get().findIndex((c) => c.id === gamepad.id);
    if (index === -1) return;

    this._connectedGamepadsStore.get().splice(index, 1);

    const gamepads = this._gamepadFactory.store.get('gamepads');
    const availableGamepad = gamepads.find((g) => g.gamepadId === gamepad.id);
    if (!availableGamepad) return;

    this._gamepadFactory.remove(availableGamepad.id);
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
