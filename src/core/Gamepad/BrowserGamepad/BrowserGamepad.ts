import { IGamepadController } from '@core/Gamepad/IGamepadController';
import { GamepadController } from '@core/Gamepad/GamepadController';
import { gamepadConfigSchema } from '@core/store/userStore';
import { z } from 'zod';
import { GamepadType } from '@core/api/GamepadType';

export const browserGamepadSchema = gamepadConfigSchema.extend({
  type: z.literal(GamepadType.WebApi),
});
export type BrowserGamepadConfig = z.infer<typeof browserGamepadSchema>;

export class BrowserGamepad extends GamepadController implements IGamepadController {
  isConnected = false;
}
