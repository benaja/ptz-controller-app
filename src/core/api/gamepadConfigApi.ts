import { emit } from '@core/events/eventBus';
import { GamepadFactory } from '@core/Gamepad/GemepadFactory';
import { defaultSecondaryKeyBindings, defualtPrimaryKeyBindings } from '@core/Gamepad/KeyBindings';
import { GamepadConfig, UserConfigStore } from '@core/store/userStore';
import { randomUUID } from 'crypto';

export enum GamepadType {
  NodeHid = 'node-hid',
  WebApi = 'web-api',
}

export type GamepadResponse = {
  connected: boolean;
} & GamepadConfig;

export class GamepadConfigApi {
  public constructor(
    private _gamepadFactory: GamepadFactory,
    private _userConfigStore: UserConfigStore,
  ) {}

  public async addGamepad(config: Omit<GamepadConfig, 'id'>): Promise<GamepadConfig> {
    const gamepads = this._userConfigStore.get('gamepads');

    const gamepad = {
      id: randomUUID(),
      ...config,
    };
    gamepads.push(gamepad);
    this._userConfigStore.set('gamepads', gamepads);

    await this._gamepadFactory.add(gamepad);

    return gamepad;
  }

  public async updateGamepad(gamepad: GamepadConfig): Promise<void> {
    console.log('updateGamepad', gamepad);
    const gamepads = this._userConfigStore.get('gamepads');

    const index = gamepads.findIndex((g) => g.id === gamepad.id);
    if (index === -1) return;

    gamepads[index] = gamepad;

    this._userConfigStore.set('gamepads', gamepads);
    await this._gamepadFactory.remove(gamepad.id);
    await this._gamepadFactory.add(gamepad);
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
