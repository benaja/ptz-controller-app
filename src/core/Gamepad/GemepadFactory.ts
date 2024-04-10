import { Factory } from '../GenericFactory/Factory';
import { IGamepadController } from './IGamepadController';

export class GamepadFactory extends Factory<IGamepadController> {
  public getByGamepadId(gamepadId: string): IGamepadController | undefined {
    return this.instances.find((i) => i.gamepadId === gamepadId);
  }
}
