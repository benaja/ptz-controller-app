import { Factory, FactoryConfig } from '../GenericFactory/Factory';
import { IGamepadController } from './IGamepadController';

type GamepadFactoryConfig = FactoryConfig & {
  connectionIndex: number;
};

export class GamepadFactory extends Factory<IGamepadController> {
  public async build(config: GamepadFactoryConfig[]) {
    super.build(config);
  }

  public async add(config: GamepadFactoryConfig): Promise<void> {
    super.add(config);
  }

  public getByConnectionIndex(connectionIndex: number): IGamepadController | undefined {
    return this.instances.find((i) => i.connectionIndex === connectionIndex);
  }
}
