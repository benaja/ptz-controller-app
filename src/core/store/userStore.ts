import { z } from 'zod';
import { Store } from '.';
import { randomUUID } from 'crypto';
import { ObsMixer } from '@main/VideoMixer/Obs/ObsMixer';
import { CameraConnectionType } from '@core/CameraConnection/CameraConnectionTypes';
import { cameraConfigSchema } from '@core/CameraConnection/CameraConnectionBuilder';

const gamepadConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  videMixer: z.string().nullable(),
  keyBindings: z.record(z.number()),
});

const videoMixerSchema = z.object({
  id: z.string(),
  name: z.string(),
  ip: z.string(),
  password: z.string().nullable(),
});

export const userConfigSchema = z.object({
  cameras: z.array(cameraConfigSchema),
  videoMixer: videoMixerSchema,
  selectedGamepads: z.array(gamepadConfigSchema).max(4),
});

export type GamepadConfig = z.infer<typeof gamepadConfigSchema>;
export type VideoMixerConfig = z.infer<typeof videoMixerSchema>;

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
        videoMixer: {
          name: new ObsMixer().name,
          ip: '127.0.0.1:4455',
          password: '',
        },
        selectedGamepads: {
          primaryGamepad: {
            id: null,
            keyBindings: {},
          },
          secondaryGamepad: {
            id: null,
            keyBindings: {},
          },
        },
      },
    });
  }
}
