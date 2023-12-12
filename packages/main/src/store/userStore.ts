import { z } from 'zod';
import { VideoMixerType } from '../VideoMixer';
import { Store } from '.';
import { randomUUID } from 'crypto';
import { ObsMixer } from '@/VideoMixer/Obs/ObsMixer';

const cameraConfigSchema = z.object({
  id: z.string(),
  number: z.number(),
  ip: z.string(),
});

const gamepadConfigSchema = z.object({
  primaryGamepad: z.object({
    id: z.string().nullable(),
    keyBindings: z.record(z.number()),
  }),
  secondaryGamepad: z.object({
    id: z.string().nullable(),
    keyBindings: z.record(z.number()),
  }),
});

const videoMixerSchema = z.object({
  name: z.string(),
  ip: z.string(),
  password: z.string(),
});

export const userConfigSchema = z.object({
  cameras: z.array(cameraConfigSchema),
  videoMixer: videoMixerSchema,
  selectedGamepads: gamepadConfigSchema,
});

export type CameraConfig = z.infer<typeof cameraConfigSchema>;
export type GamepadConfig = z.infer<typeof gamepadConfigSchema>;
export type UserConfig = z.infer<typeof userConfigSchema>;
export type VideoMixerConfig = z.infer<typeof videoMixerSchema>;

export const userConfigStore = new Store<UserConfig>({
  configName: 'userConfig',
  schema: userConfigSchema,
  defaults: {
    cameras: [
      {
        id: randomUUID(),
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
