import { IBuilder } from '@core/GenericFactory/IBuilder';
import { z } from 'zod';
import { IGamepadController, baseGamepadSchema } from '../IGamepadController';
import { GamepadType } from '@core/api/GamepadType';
import { BrowserGamepad } from './BrowserGamepad';
import { CameraFactory } from '@core/CameraConnection/CameraFactory';
import { VideomixerFactory } from '@core/VideoMixer/VideoMixerFactory';
import { defaultKeyBindings } from '@core/Gamepad/KeyBindings';
import { GamepadConfig } from '@core/repositories/GamepadRepository';
import { INotificationApi } from '@core/api/INotificationApi';

export type BrowserGamepadConfig = z.infer<typeof baseGamepadSchema>;

export class BrowserGamepadBuilder implements IBuilder<IGamepadController> {
  public constructor(
    private _cameraFactory: CameraFactory,
    private _videoMixerFactory: VideomixerFactory,
    private _notificationApi: INotificationApi,
  ) {}

  public supportedTypes(): string[] {
    return [GamepadType.WebApi];
  }

  public validationSchema() {
    return baseGamepadSchema;
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
          this._notificationApi,
          defaultKeyBindings,
        );
      default:
        throw new Error(`Gamepad type ${config.type} not supported`);
    }
  }
}
