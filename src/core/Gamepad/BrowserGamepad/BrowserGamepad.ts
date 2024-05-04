import { IGamepadController, baseGamepadSchema } from '@core/Gamepad/IGamepadController';
import { GamepadController } from '@core/Gamepad/GamepadController';
import { z } from 'zod';
import { GamepadType } from '@core/api/GamepadType';

export const browserGamepadSchema = baseGamepadSchema.extend({
  gamepadId: z.string(),
  type: z.literal(GamepadType.WebApi),
});
export type BrowserGamepadConfig = z.infer<typeof browserGamepadSchema>;

export class BrowserGamepad extends GamepadController implements IGamepadController {
  isConnected = false;
}
