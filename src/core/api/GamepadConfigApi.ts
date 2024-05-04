import { GamepadFactory } from '@core/Gamepad/GemepadFactory';
import { GamepadConfig, GamepadRepository } from '@core/repositories/GamepadRepository';
import { ConnectedGamepadStore } from '@core/store/ConnectedGamepadsStore';

export type GamepadResponse = {
  connected: boolean;
} & GamepadConfig;

export class GamepadConfigApi {
  public constructor(
    private _gamepadFactory: GamepadFactory,
    private _connectedGamepadsStore: ConnectedGamepadStore,
    private _gamepadRepository: GamepadRepository,
  ) {}

  public async addGamepad(config: any): Promise<GamepadConfig> {
    const gamepad = this._gamepadRepository.add(config);

    console.log('addGamepad', gamepad);

    await this._gamepadFactory.add(gamepad);

    return gamepad;
  }

  public async updateGamepad(data: GamepadConfig): Promise<void> {
    const gamepad = this._gamepadRepository.update(data.id, data);

    if (!gamepad) return;

    if (this._gamepadFactory.get(data.id)) {
      await this._gamepadFactory.remove(data.id);
    }
    await this._gamepadFactory.add(gamepad);
  }

  public async removeGamepad(id: string): Promise<void> {
    this._gamepadRepository.delete(id);

    await this._gamepadFactory.remove(id);
  }

  public getGamepad(id: string): GamepadResponse | undefined {
    const gamepad = this._gamepadRepository.getById(id);

    if (!gamepad) return undefined;

    return {
      ...gamepad,
      connected: !!this._gamepadFactory.get(id)?.isConnected,
    };
  }

  public getGamepads(): GamepadResponse[] {
    return this._gamepadRepository.getAll().map((gamepad) => ({
      ...gamepad,
      connected: !!this._gamepadFactory.get(gamepad.id)?.isConnected,
    }));
  }
}
