import { z } from 'zod';
import { Repository } from './Repository';
import { browserGamepadSchema } from '@core/Gamepad/BrowserGamepad/BrowserGamepad';
import { nodeGamepadSchema, ps4GamepadSchema } from '@core/Gamepad/NodeGamepad/NodeGamepad';

const gamepadConfigSchema = z.discriminatedUnion('type', [
  browserGamepadSchema,
  nodeGamepadSchema,
  ps4GamepadSchema,
]);
export type GamepadConfig = z.infer<typeof gamepadConfigSchema>;

export class GamepadRepository extends Repository<GamepadConfig> {
  constructor() {
    super('gamepad', gamepadConfigSchema);
  }
}
