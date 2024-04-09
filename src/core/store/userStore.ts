import { z } from 'zod';
import { Store } from '.';
import { randomUUID } from 'crypto';
import { CameraConnectionType } from '@core/CameraConnection/CameraConnectionTypes';
import { cameraConfigSchema } from '@core/CameraConnection/ArduinoPtzCameraBuilder';
import { VideoMixerType } from '@core/VideoMixer/VideoMixerType';
import { GamepadType } from '@core/api/GamepadType';

export const gamepadConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(GamepadType),
  videoMixerId: z.string().nullable(),
  keyBindings: z.record(z.number()),
  gamepadId: z.string(),
});

export const userConfigSchema = z.object({
  cameras: z.array(z.any()),
  videoMixers: z.array(z.any()),
  gamepads: z.array(z.any()).max(4),
});

export type GamepadConfig = z.infer<typeof gamepadConfigSchema>;

export type UserConfig = z.infer<typeof userConfigSchema>;

export class UserConfigStore<T> extends Store<T, typeof userConfigSchema> {
  constructor() {
    super({
      configName: 'userConfig',
      schema: userConfigSchema,
      defaults: {
        cameras: [],
        videoMixers: [],
        gamepads: [],
      },
    });
  }
}
