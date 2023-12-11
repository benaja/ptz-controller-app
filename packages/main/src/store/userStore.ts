import { z } from 'zod';
import { VideoMixerType } from '../VideoMixer';
import { Store } from '.';
import { randomUUID } from 'crypto';
import { PanCameraAction } from '@/gamepad/actions/PanCameraAction';
import { TiltCameraAction } from '@/gamepad/actions/TiltCameraAction';
import { ZoomCameraAction } from '@/gamepad/actions/ZoomCameraAction';

const cameraConfigSchema = z.object({
  id: z.string(),
  number: z.number(),
  ip: z.string(),
  name: z.string(),
  port: z.number(),
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

export const userConfigSchema = z.object({
  cameras: z.array(cameraConfigSchema),
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
    cameras: [
      {
        id: randomUUID(),
        name: 'Camera 1',
        ip: '192.168.0.31',
        port: 3000,
        number: 1,
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
      primaryGamepad: {
        id: null,
        keyBindings: {
          [TiltCameraAction.name]: 0,
          [PanCameraAction.name]: 1,
          [ZoomCameraAction.name]: 3,
        },
      },
      secondaryGamepad: {
        id: null,
        keyBindings: {},
      },
    },
  },
});
