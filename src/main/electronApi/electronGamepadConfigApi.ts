import { GamepadConfigApi } from '@core/api/GamepadConfigApi';
import { GamepadConfig } from '@core/store/userStore';

export class ElectronGamepadConfigApi {
  constructor(private _gamepadConfigApi: GamepadConfigApi) {}

  async addGamepad(config: Omit<GamepadConfig, 'id'>) {
    return this._gamepadConfigApi.addGamepad(config);
  }
  async updateGamepad(config: GamepadConfig) {
    return this._gamepadConfigApi.updateGamepad(config);
  }

  async removeGamepad(id: string) {
    return this._gamepadConfigApi.removeGamepad(id);
  }

  async getGamepad(id: string) {
    return this._gamepadConfigApi.getGamepad(id);
  }
  async getGamepads() {
    return this._gamepadConfigApi.getGamepads();
  }
}
