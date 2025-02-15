import { IBuilder } from '@core/GenericFactory/IBuilder';
import { z, ZodObject, ZodUnion } from 'zod';
import { IGamepadController, baseGamepadSchema } from '../IGamepadController';
import { GamepadType } from '@core/api/GamepadType';
import { CameraFactory } from '@core/CameraConnection/CameraFactory';
import { VideomixerFactory } from '@core/VideoMixer/VideoMixerFactory';
import { defaultAxisBindings, defaultButtonBindings } from '@core/Gamepad/KeyBindings';
import { GamepadConfig } from '@core/repositories/GamepadRepository';
import { INotificationApi } from '@core/api/INotificationApi';
import { NodeGamepad, nodeGamepadSchema } from './NodeGamepad';

export type NodeGamepadConfig = z.infer<typeof nodeGamepadSchema>;

export class NodeGamepadBuilder implements IBuilder<IGamepadController> {
  public constructor(
    private _cameraFactory: CameraFactory,
    private _videoMixerFactory: VideomixerFactory,
    private _notificationApi: INotificationApi,
  ) {}

  public supportedTypes(): string[] {
    return [GamepadType.LogitechN310, GamepadType.SonyPs4];
  }

  public validationSchema() {
    return nodeGamepadSchema;
  }

  public async build(config: GamepadConfig): Promise<IGamepadController> {
    switch (config.type) {
      case GamepadType.SonyPs4:
      case GamepadType.LogitechN310:
        return new NodeGamepad(
          config,
          this._cameraFactory,
          this._videoMixerFactory,
          this._notificationApi,
          defaultButtonBindings,
          defaultAxisBindings,
        );
      default:
        throw new Error(`Gamepad type ${config.type} not supported`);
    }
  }
}
