import { z } from 'zod';
import { VideoMixerType } from '../VideoMixer';
import { Store } from '.';

const cameraConfigSchema = z.object({
  id: z.number(),
  ip: z.string(),
  port: z.string(),
});

const gamepadConfigSchema = z.object({
  primaryGamepad: z.string().nullable(),
  secondaryGamepad: z.string().nullable(),
});

export const userConfigSchema = z.object({
  cams: z.array(cameraConfigSchema),
  videoMixers: z.array(
    z.object({
      type: z.nativeEnum(VideoMixerType),
      instance: z.number(),
      ip: z.string(),
      mixEffectBlock: z.number(),
    }),
  ),
  selectedGamepads: gamepadConfigSchema,
});

export type CameraConfig = z.infer<typeof cameraConfigSchema>;
export type GamepadConfig = z.infer<typeof gamepadConfigSchema>;
export type UserConfig = z.infer<typeof userConfigSchema>;

export const userConfigStore = new Store<UserConfig>({
  configName: 'userConfig',
  schema: userConfigSchema,
  defaults: {
    cams: [
      {
        id: 1,
        ip: '192.168.0.31',
        port: '/dev/ttyACM0',
      },
    ],
    videoMixers: [
      {
        type: VideoMixerType.Obs,
        instance: 1,
        ip: '192.168.1.112',
        mixEffectBlock: 0,
      },
    ],
    selectedGamepads: {
      primaryGamepad: null,
      secondaryGamepad: null,
    },
  },
});
