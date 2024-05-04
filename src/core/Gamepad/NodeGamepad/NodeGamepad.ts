import { IGamepadController, baseGamepadSchema } from '@core/Gamepad/IGamepadController';
import { GamepadController } from '@core/Gamepad/GamepadController';
import { z } from 'zod';
import { GamepadType } from '@core/api/GamepadType';
import { GamepadConfig } from '@core/repositories/GamepadRepository';
import { CameraFactory } from '@core/CameraConnection/CameraFactory';
import { VideomixerFactory } from '@core/VideoMixer/VideoMixerFactory';
import { INotificationApi } from '@core/api/INotificationApi';
import { NodeGamepad as NodeGamepadApi } from '@sensslen/node-gamepad';
import * as f310 from '@sensslen/node-gamepad/controllers/logitech/gamepadf310.json';
import * as ps4 from './ps4.json';

import { HID, devices } from 'node-hid';

export const nodeGamepadSchema = baseGamepadSchema.extend({
  type: z.literal(GamepadType.NodeHid),
});
export const ps4GamepadSchema = baseGamepadSchema.extend({
  type: z.literal(GamepadType.Ps4NodeHid),
});
export type NodeGamepadConfig = z.infer<typeof nodeGamepadSchema>;

export class NodeGamepad extends GamepadController implements IGamepadController {
  isConnected = false;

  constructor(
    _config: GamepadConfig,
    _cameraFactory: CameraFactory,
    _videoMixerFactory: VideomixerFactory,
    _notificationApi: INotificationApi,
    keyBindings: Record<string, number>,
  ) {
    super(_config, _cameraFactory, _videoMixerFactory, _notificationApi, keyBindings);

    console.log('devices', devices());

    console.log('config', JSON.parse(JSON.stringify(ps4)));

    let gamepad = new NodeGamepadApi(ps4, {
      info(toLog) {
        console.log('info', toLog);
      },
      debug(toLog) {
        console.log('debug', toLog);
      },
    });

    console.log('node gamepad', gamepad);

    // gamepad.

    gamepad.on('connected', function () {
      console.log('connected');
    });
    gamepad.on('disconnected', function () {
      console.log('disconnected');
    });

    gamepad.on('up:press', function () {
      console.log('up');
    });
    gamepad.on('down:press', function () {
      console.log('down');
    });

    gamepad.start();
  }
}
