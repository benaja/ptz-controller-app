import { Store } from '@core/store';
import { Factory } from '../GenericFactory/Factory';
import { IGamepadController } from './IGamepadController';
import { z } from 'zod';
import { browserGamepadSchema } from './BrowserGamepad/BrowserGamepad';

// const gamepadConfigSchema = z.union([browserGamepadSchema, z.any()]);

export class GamepadFactory extends Factory<IGamepadController> {
  public store = new Store({
    configName: 'gamepad',
    schema: z.object({
      gamepads: z.array(browserGamepadSchema),
    }),
    defaults: {
      gamepads: [],
    },
  });

  public getByGamepadId(gamepadId: string): IGamepadController | undefined {
    return this.instances.find((i) => i.gamepadId === gamepadId);
  }
}
