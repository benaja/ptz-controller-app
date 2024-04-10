import { z } from 'zod';
import { Repository } from './Repository';
import { browserGamepadSchema } from '@core/Gamepad/BrowserGamepad/BrowserGamepad';

export type GamepadConfig = z.infer<typeof browserGamepadSchema>;

export class GamepadRepository extends Repository<GamepadConfig> {
  constructor() {
    super('gamepad', browserGamepadSchema);
  }
}
