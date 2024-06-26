import { IDisposable } from '@core/GenericFactory/IDisposable';
import { AxisEventPayload, ButtonEventPayload } from '@core/api/ConnectedGamepadApi';
import { z } from 'zod';

export const baseGamepadSchema = z.object({
  id: z.string(),
  name: z.string(),
  videoMixerId: z.string().nullable(),
  keyBindings: z.record(z.number()),
});

export type BaseGamepadConfig = z.infer<typeof baseGamepadSchema>;

export interface IGamepadController extends IDisposable {
  isConnected: boolean;
  gamepadId: string;

  onAxis(axis: AxisEventPayload): void;
  onButton(button: ButtonEventPayload): void;
}
