import { z } from 'zod';
import fs from 'fs';
import { VideoMixerType } from './VideoMixer';

const cameraConfigSchema = z.object({
  id: z.number(),
  ip: z.string(),
  port: z.string(),
});

const gamepadSchema = z.object({
  id: z.string(),
  connectionIndex: z.number(),
});

const gamepadConfigSchema = z.object({
  primaryGamepad: gamepadSchema.nullable(),
  secondaryGamepad: gamepadSchema.nullable(),
});

const schema = z.object({
  cams: z.array(cameraConfigSchema),
  videoMixers: z.array(
    z.object({
      type: z.nativeEnum(VideoMixerType),
      instance: z.number(),
      ip: z.string(),
      mixEffectBlock: z.number(),
    })
  ),
  selectedGamepads: gamepadConfigSchema,
});

export type CameraConfig = z.infer<typeof cameraConfigSchema>;
export type GamepadConfig = z.infer<typeof gamepadConfigSchema>;
export type UserConfig = z.infer<typeof schema>;

/**
 * Loads the config file from the given path. If the file is not found or the
 * file is not valid JSON, the process will exit with an error.
 */
export function loadConfig(configPath: string): UserConfig {
  let jsonConfig: undefined;

  try {
    jsonConfig = JSON.parse(fs.readFileSync(configPath).toString());
  } catch (error) {
    const typedError = error as Error;
    console.error(typedError.message);
    process.exit(1);
  }

  const config = schema.safeParse(jsonConfig);

  if (!config.success) {
    console.error(config.error.message);
    process.exit(1);
  }

  return config.data;
}
