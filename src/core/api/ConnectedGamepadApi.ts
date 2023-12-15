import { GamepadFactory } from '@core/Gamepad/GemepadFactory';
import { ConnectedGamepadStore } from '@core/store/ConnectedGamepadsStore';
import { UserConfigStore } from '@core/store/userStore';

export type ConnectedGamepad = {
  id: string;
  connectionIndex: number;
};

export type ConnectedGamepadResponse = {
  isUse: boolean;
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
    private _userConfigStore: UserConfigStore,
    private _connectedGamepadsStore: ConnectedGamepadStore,
  ) {}

  public getConnectedGamepads(): ConnectedGamepadResponse[] {
    console.log('getConnectedGamepads', this._connectedGamepadsStore.get());
    return this._connectedGamepadsStore.get().map((c) => ({
      ...c,
      isUse: this._gamepadFactory.getByConnectionIndex(c.connectionIndex) !== undefined,
    }));
  }

  public gamepadConnected(gamepad: ConnectedGamepad): void {
    console.log('camepadConnected', gamepad);
    if (
      this._connectedGamepadsStore
        .get()
        .find((gamepad) => gamepad.connectionIndex === gamepad.connectionIndex)
    ) {
      return;
    }
    this._connectedGamepadsStore.get().push(gamepad);

    const gamepads = this._userConfigStore.get('gamepads');
    const availableGamepad = gamepads.find(
      (g) => g.connectedGamepadId === gamepad.id && g.connectionIndex >= 0,
    );

    console.log('availableGamepad', availableGamepad);

    if (!availableGamepad) return;

    availableGamepad.connectionIndex = gamepad.connectionIndex;
    this._userConfigStore.set('gamepads', gamepads);

    this._gamepadFactory.add(availableGamepad);

    console.log('connected pads', this._connectedGamepadsStore.get());
  }

  public gamepadDisconnected(gamepad: ConnectedGamepad): void {
    const index = this._connectedGamepadsStore
      .get()
      .findIndex((c) => c.connectionIndex === gamepad.connectionIndex);
    if (index === -1) return;

    this._connectedGamepadsStore.get().splice(index, 1);

    const gamepads = this._userConfigStore.get('gamepads');
    const availableGamepad = gamepads.find(
      (g) => g.connectedGamepadId === gamepad.id && g.connectionIndex === gamepad.connectionIndex,
    );
    if (!availableGamepad) return;

    availableGamepad.connectionIndex = -1;
    this._userConfigStore.set('gamepads', gamepads);

    this._gamepadFactory.remove(availableGamepad.id);
  }

  public updateConnectedGamepads(gamepads: ConnectedGamepad[]): void {
    const originalGamepads = [...this._connectedGamepadsStore.get()];

    // this._connectedGamepadsStore.set(gemapads);

    const addedGamepads = gamepads.filter(
      (gamepad) =>
        !originalGamepads.find(
          (originalGamepad) =>
            originalGamepad.id === gamepad.id &&
            originalGamepad.connectionIndex === gamepad.connectionIndex,
        ),
    );
    const removedGamepads = originalGamepads.filter(
      (gamepad) =>
        !gamepads.find(
          (connectedGamepad) =>
            connectedGamepad.id === gamepad.id &&
            connectedGamepad.connectionIndex === gamepad.connectionIndex,
        ),
    );

    console.log('addedGamepads', addedGamepads);
    console.log('removedGamepads', removedGamepads);

    addedGamepads.forEach((gamepad) => {
      this.gamepadConnected(gamepad);
    });
    removedGamepads.forEach((gamepad) => {
      this.gamepadDisconnected(gamepad);
    });
  }

  public triggerButtonEvent(event: ButtonEventPayload) {
    const gamepad = this._gamepadFactory.getByConnectionIndex(event.gamepad.connectionIndex);
    if (!gamepad) return;

    gamepad.onButton(event);
  }

  public triggerAxisEvent(event: AxisEventPayload) {
    const gamepad = this._gamepadFactory.getByConnectionIndex(event.gamepad.connectionIndex);
    if (!gamepad) return;

    gamepad.onAxis(event);
  }
}
