import { GamepadFactory } from '@core/Gamepad/GemepadFactory';
import { ConnectedGamepadStore } from '@core/store/ConnectedGamepadsStore';
import { GamepadConfig, UserConfigStore } from '@core/store/userStore';
import { randomUUID } from 'crypto';

export type GamepadResponse = {
  connected: boolean;
} & GamepadConfig;

export class GamepadConfigApi {
  public constructor(
    private _gamepadFactory: GamepadFactory,
    private _userConfigStore: UserConfigStore,
    private _connectedGamepadsStore: ConnectedGamepadStore,
  ) {}

  private _getGamepadId(connectionIndex: number) {
    console.log('connected Gamepads', connectionIndex, this._connectedGamepadsStore.get());
    const connectedGamepad = this._connectedGamepadsStore
      .get()
      .find((c) => c.connectionIndex === connectionIndex);

    if (!connectedGamepad) {
      return null;
    }

    return connectedGamepad;
  }

  public async addGamepad(
    config: Omit<GamepadConfig, 'id' | 'connectedGamepadId'>,
  ): Promise<GamepadConfig> {
    const schema = this._gamepadFactory.validationSchema(config.type);

    schema.omit({ id: true, connectedGamepadId: true }).parse(config);

    const gamepads = this._userConfigStore.get('gamepads');

    const connectedGamepad = this._getGamepadId(config.connectionIndex);

    const gamepad: GamepadConfig = {
      ...config,
      id: randomUUID(),
      connectedGamepadId: connectedGamepad?.id,
    };
    gamepads.push(gamepad);
    this._userConfigStore.set('gamepads', gamepads);

    console.log('addGamepad', gamepad);

    await this._gamepadFactory.add(gamepad);

    return gamepad;
  }

  public async updateGamepad(gamepad: Omit<GamepadConfig, 'connectedGamepadId'>): Promise<void> {
    const gamepads = this._userConfigStore.get('gamepads');

    const index = gamepads.findIndex((g) => g.id === gamepad.id);
    if (index === -1) return;

    const connectedGamepad = this._getGamepadId(gamepad.connectionIndex);

    const updatedGamepad: GamepadConfig = {
      ...gamepad,
      connectedGamepadId: connectedGamepad.id,
    };
    gamepads[index] = updatedGamepad;

    this._userConfigStore.set('gamepads', gamepads);
    await this._gamepadFactory.remove(gamepad.id);
    await this._gamepadFactory.add(updatedGamepad);
  }

  public async removeGamepad(id: string): Promise<void> {
    const gamepads = this._userConfigStore.get('gamepads');

    const index = gamepads.findIndex((g) => g.id === id);
    if (index === -1) return;

    gamepads.splice(index, 1);

    this._userConfigStore.set('gamepads', gamepads);

    await this._gamepadFactory.remove(id);
  }

  public getGamepad(id: string): GamepadResponse | undefined {
    const gamepad = this._userConfigStore.get('gamepads').find((g) => g.id === id);

    if (!gamepad) return undefined;

    return {
      ...gamepad,
      connected: this._gamepadFactory.get(id)?.isConnected || false,
    };
  }

  public getGamepads(): GamepadResponse[] {
    return this._userConfigStore.get('gamepads').map((gamepad) => ({
      ...gamepad,
      connected: this._gamepadFactory.get(gamepad.id)?.isConnected || false,
    }));
  }
}
