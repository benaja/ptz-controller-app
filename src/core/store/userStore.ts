import { z } from 'zod';
import { Store } from '.';
import { randomUUID } from 'crypto';
import { CameraConnectionType } from '@core/CameraConnection/CameraConnectionTypes';
import { cameraConfigSchema } from '@core/CameraConnection/CameraConnectionBuilder';
import { videoMixerConfigSchema } from '@core/VideoMixer/VideoMixerBuilder';
import { VideoMixerType } from '@core/VideoMixer/VideoMixerType';

export const gamepadConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  connectedGamepadId: z.string().nullable(),
  connectionIndex: z.number(),
  type: z.string(),
  videMixer: z.string().nullable(),
  keyBindings: z.record(z.number()),
});

export const userConfigSchema = z.object({
  cameras: z.array(cameraConfigSchema),
  videoMixers: z.array(videoMixerConfigSchema),
  gamepads: z.array(gamepadConfigSchema).max(4),
});

export type GamepadConfig = z.infer<typeof gamepadConfigSchema>;

export type UserConfig = z.infer<typeof userConfigSchema>;

export class UserConfigStore extends Store<UserConfig> {
  constructor() {
    super({
      configName: 'userConfig',
      schema: userConfigSchema,
      defaults: {
        cameras: [
          {
            id: randomUUID(),
            type: CameraConnectionType.ArduinoPtzCamera,
            ip: '192.168.0.31',
            number: 1,
          },
        ],
        videoMixers: [
          {
            id: randomUUID(),
            type: VideoMixerType.OBS,
            name: 'safla',
            ip: '127.0.0.1:4455',
            password: '',
          },
        ],
        gamepads: [],
      },
    });
  }
}
