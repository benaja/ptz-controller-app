import { IBuilder } from '@core/GenericFactory/IBuilder';
import { z } from 'zod';
import { IGamepadController } from '../IGamepadController';
import { UserConfigStore, gamepadConfigSchema } from '@core/store/userStore';
import { GamepadType } from '@core/api/GamepadType';
import { BrowserGamepad } from './BrowserGamepad';
import { CameraFactory } from '@core/CameraConnection/CameraFactory';
import { VideomixerFactory } from '@core/VideoMixer/VideoMixerFactory';
import { defaultKeyBindings } from '@core/Gamepad/KeyBindings';

export type GamepadConfig = z.infer<typeof gamepadConfigSchema>;

export class BrowserGamepadBuilder implements IBuilder<IGamepadController> {
  public constructor(
    private _cameraFactory: CameraFactory,
    private _videoMixerFactory: VideomixerFactory,
  ) {}

  public supportedTypes(): string[] {
    return [GamepadType.WebApi];
  }

  public validationSchema() {
    return gamepadConfigSchema;
  }

  public async build(config: GamepadConfig): Promise<IGamepadController> {
    // const gamepads = this._userConfigStore.get('gamepads');
    // const gamepad = gamepads.find((g) => g.id === config.id);

    console.log('build browser gamepad', config);

    switch (config.type) {
      case GamepadType.WebApi:
        return new BrowserGamepad(
          config,
          this._cameraFactory,
          this._videoMixerFactory,
          defaultKeyBindings,
        );
      default:
        throw new Error(`Gamepad type ${config.type} not supported`);
    }
  }
}
