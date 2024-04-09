import { GamepadConfig } from '@core/Gamepad/BrowserGamepad/BrowserGamepadBuilder';
import { GamepadFactory } from '@core/Gamepad/GemepadFactory';
import { ConnectedGamepadStore } from '@core/store/ConnectedGamepadsStore';
import { randomUUID } from 'crypto';

export type GamepadResponse = {
  connected: boolean;
} & GamepadConfig;

export class GamepadConfigApi {
  public constructor(
    private _gamepadFactory: GamepadFactory,
    private _connectedGamepadsStore: ConnectedGamepadStore,
  ) {}

  public async addGamepad(config: any): Promise<GamepadConfig> {
    const schema = this._gamepadFactory.validationSchema(config.type);

    schema.omit({ id: true }).parse(config);

    const gamepads = this._gamepadFactory.store.get('gamepads');

    const gamepad: GamepadConfig = {
      ...config,
      id: randomUUID(),
    };
    gamepads.push(gamepad);
    this._gamepadFactory.store.set('gamepads', gamepads);

    console.log('addGamepad', gamepad);

    await this._gamepadFactory.add(gamepad);

    return gamepad;
  }

  public async updateGamepad(gamepad: GamepadConfig): Promise<void> {
    const schema = this._gamepadFactory.validationSchema(gamepad.type);
    schema.parse(gamepad);

    const gamepads = this._gamepadFactory.store.get('gamepads');

    const index = gamepads.findIndex((g) => g.id === gamepad.id);
    if (index === -1) return;

    const updatedGamepad: GamepadConfig = {
      ...gamepad,
    };
    gamepads[index] = updatedGamepad;

    this._gamepadFactory.store.set('gamepads', gamepads);
    if (this._gamepadFactory.get(gamepad.id)) {
      await this._gamepadFactory.remove(gamepad.id);
    }
    await this._gamepadFactory.add(updatedGamepad);
  }

  public async removeGamepad(id: string): Promise<void> {
    const gamepads = this._gamepadFactory.store.get('gamepads');

    const index = gamepads.findIndex((g) => g.id === id);
    if (index === -1) return;

    gamepads.splice(index, 1);

    this._gamepadFactory.store.set('gamepads', gamepads);

    await this._gamepadFactory.remove(id);
  }

  public getGamepad(id: string): GamepadResponse | undefined {
    const gamepad = this._gamepadFactory.store.get('gamepads').find((g) => g.id === id);

    if (!gamepad) return undefined;

    return {
      ...gamepad,
      connected: !!this._gamepadFactory.get(id),
    };
  }

  public getGamepads(): GamepadResponse[] {
    return this._gamepadFactory.store.get('gamepads').map((gamepad) => ({
      ...gamepad,
      connected: !!this._gamepadFactory.get(gamepad.id),
    }));
  }
}
