import { z } from 'zod';
import { Repository } from './Repository';
import { browserGamepadSchema } from '@core/Gamepad/BrowserGamepad/BrowserGamepad';
import { logitechN310Schema, sonyPs4Schema } from '@core/Gamepad/NodeGamepad/NodeGamepad';

const gamepadConfigSchema = z.discriminatedUnion('type', [
  browserGamepadSchema,
  logitechN310Schema,
  sonyPs4Schema,
]);
export type GamepadConfig = z.infer<typeof gamepadConfigSchema>;

export class GamepadRepository extends Repository<GamepadConfig> {
  constructor() {
    super('gamepad', gamepadConfigSchema);
  }
}
