import { IBuilder } from '@core/GenericFactory/IBuilder';
import { atemMixerConfigSchema } from '@core/VideoMixer/Blackmagicdesign/Atem';
import { ObsMixer, obsMixerConfigSchema } from '@core/VideoMixer/Obs/ObsMixer';
import { z } from 'zod';
import { IGamepadController } from '../../core/Gamepad/IGamepadController';
import { VideoMixerType } from '@core/VideoMixer/VideoMixerType';
import { GamepadType } from '@core/api/gamepadConfigApi';
import { gamepadConfigSchema } from '@core/store/userStore';
import { BrowserGamepad } from './BrowserGamepad';

export type GamepadConfig = z.infer<typeof gamepadConfigSchema>;

export class BrowserGamepadBuilder implements IBuilder<IGamepadController> {
  public async supportedTypes(): Promise<string[]> {
    return [GamepadType.WebApi];
  }

  public async build(config: GamepadConfig): Promise<IGamepadController> {
    switch (config.type) {
      case GamepadType.WebApi:
        return new BrowserGamepad(config);
      default:
        throw new Error(`Gamepad type ${config.type} not supported`);
    }
  }
}
