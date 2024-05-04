import { IGamepadController, baseGamepadSchema } from '@core/Gamepad/IGamepadController';
import { GamepadController } from '@core/Gamepad/GamepadController';
import { z } from 'zod';
import { GamepadType } from '@core/api/GamepadType';
import { GamepadConfig } from '@core/repositories/GamepadRepository';
import { CameraFactory } from '@core/CameraConnection/CameraFactory';
import { VideomixerFactory } from '@core/VideoMixer/VideoMixerFactory';
import { INotificationApi } from '@core/api/INotificationApi';
import { NodeGamepad as NodeGamepadApi } from '@sensslen/node-gamepad';
import * as f310 from './f310.json';
import * as ps4 from './ps4.json';

import { GamepadButtons } from '../KeyBindings';
import log from 'electron-log/main';
import { devices } from 'node-hid';

export const logitechN310Schema = baseGamepadSchema.extend({
  type: z.literal(GamepadType.LogitechN310),
});
export const sonyPs4Schema = baseGamepadSchema.extend({
  type: z.literal(GamepadType.SonyPs4),
});
export type LogitechN310Schema = z.infer<typeof logitechN310Schema>;
export type SonyPs4Schema = z.infer<typeof sonyPs4Schema>;

export class NodeGamepad extends GamepadController implements IGamepadController {
  private _isConnected = false;

  constructor(
    _config: GamepadConfig,
    _cameraFactory: CameraFactory,
    _videoMixerFactory: VideomixerFactory,
    _notificationApi: INotificationApi,
    keyBindings: Record<string, number>,
  ) {
    super(_config, _cameraFactory, _videoMixerFactory, _notificationApi, keyBindings);

    let gamepad: NodeGamepadApi;

    switch (_config.type) {
      case GamepadType.SonyPs4:
        gamepad = new NodeGamepadApi(ps4);
        break;
      case GamepadType.LogitechN310:
        gamepad = new NodeGamepadApi(f310);
        break;
      default:
        throw new Error(`Gamepad type ${_config.type} not supported`);
    }

    log.info('connecting to gamepad', _config);

    log.info('devices', devices());

    gamepad.on('connected', () => {
      log.info('connected');
      this.isConnected = true;
    });
    gamepad.on('disconnected', () => {
      log.info('disconnected');
      this.isConnected = false;
    });

    gamepad.on('left:move', (value) => {
      this.onAxis({
        axis: 0,
        value: (value.x - 128) / 128,
      });
      this.onAxis({
        axis: 1,
        value: (value.y - 128) / 128,
      });
    });

    gamepad.on('leftJoystick:move', (value) => {
      this.onAxis({
        axis: 0,
        value: (value.x - 128) / 128,
      });
      this.onAxis({
        axis: 1,
        value: (value.y - 128) / 128,
      });
    });

    gamepad.on('right:move', (value) => {
      this.onAxis({
        axis: 2,
        value: (value.x - 128) / 128,
      });
      this.onAxis({
        axis: 3,
        value: (value.y - 128) / 128,
      });
    });

    gamepad.on('rightJoystick:move', (value) => {
      this.onAxis({
        axis: 2,
        value: (value.x - 128) / 128,
      });
      this.onAxis({
        axis: 3,
        value: (value.y - 128) / 128,
      });
    });

    gamepad.on('dpadLeft:press', () => {
      this.onButton({
        button: GamepadButtons.LeftBumper,
        pressed: true,
        value: 1,
      });
    });

    gamepad.on('dpadLeft:release', () => {
      this.onButton({
        button: GamepadButtons.LeftBumper,
        pressed: false,
        value: 0,
      });
    });

    gamepad.on('dpadUp:press', () => {
      this.onButton({
        button: GamepadButtons.DPadUp,
        pressed: true,
        value: 1,
      });
    });

    gamepad.on('dpadUp:release', () => {
      this.onButton({
        button: GamepadButtons.DPadUp,
        pressed: false,
        value: 0,
      });
    });

    gamepad.on('dpadRight:press', () => {
      this.onButton({
        button: GamepadButtons.DPadRight,
        pressed: true,
        value: 1,
      });
    });

    gamepad.on('dpadRight:release', () => {
      this.onButton({
        button: GamepadButtons.DPadRight,
        pressed: false,
        value: 0,
      });
    });

    gamepad.on('dpadDown:press', () => {
      this.onButton({
        button: GamepadButtons.DPadDown,
        pressed: true,
        value: 1,
      });
    });

    gamepad.on('dpadDown:release', () => {
      this.onButton({
        button: GamepadButtons.DPadDown,
        pressed: false,
        value: 0,
      });
    });

    gamepad.on('RB:press', () => {
      this.onButton({
        button: GamepadButtons.RightBumper,
        pressed: true,
        value: 1,
      });
    });

    gamepad.on('RB:release', () => {
      this.onButton({
        button: GamepadButtons.RightBumper,
        pressed: false,
        value: 0,
      });
    });

    gamepad.on('LB:press', () => {
      this.onButton({
        button: GamepadButtons.LeftBumper,
        pressed: true,
        value: 1,
      });
    });

    gamepad.on('LB:release', () => {
      this.onButton({
        button: GamepadButtons.LeftBumper,
        pressed: false,
        value: 0,
      });
    });

    gamepad.on('LT:press', () => {
      this.onButton({
        button: GamepadButtons.LeftTrigger,
        pressed: true,
        value: 1,
      });
    });

    gamepad.on('LT:release', () => {
      this.onButton({
        button: GamepadButtons.LeftTrigger,
        pressed: false,
        value: 0,
      });
    });

    gamepad.on('RT:press', () => {
      this.onButton({
        button: GamepadButtons.RightTrigger,
        pressed: true,
        value: 1,
      });
    });

    gamepad.on('RT:release', () => {
      this.onButton({
        button: GamepadButtons.RightTrigger,
        pressed: false,
        value: 0,
      });
    });

    gamepad.on('A:press', () => {
      this.onButton({
        button: GamepadButtons.A,
        pressed: true,
        value: 1,
      });
    });

    gamepad.on('A:release', () => {
      this.onButton({
        button: GamepadButtons.A,
        pressed: false,
        value: 0,
      });
    });

    gamepad.on('B:press', () => {
      this.onButton({
        button: GamepadButtons.B,
        pressed: true,
        value: 1,
      });
    });

    gamepad.on('B:release', () => {
      this.onButton({
        button: GamepadButtons.B,
        pressed: false,
        value: 0,
      });
    });

    gamepad.on('X:press', () => {
      this.onButton({
        button: GamepadButtons.X,
        pressed: true,
        value: 1,
      });
    });

    gamepad.on('X:release', () => {
      this.onButton({
        button: GamepadButtons.X,
        pressed: false,
        value: 0,
      });
    });

    gamepad.on('Y:press', () => {
      this.onButton({
        button: GamepadButtons.Y,
        pressed: true,
        value: 1,
      });
    });

    gamepad.on('Y:release', () => {
      this.onButton({
        button: GamepadButtons.Y,
        pressed: false,
        value: 0,
      });
    });

    gamepad.on('back:press', () => {
      this.onButton({
        button: GamepadButtons.Back,
        pressed: true,
        value: 1,
      });
    });

    gamepad.on('back:release', () => {
      this.onButton({
        button: GamepadButtons.Back,
        pressed: false,
        value: 0,
      });
    });

    gamepad.on('start:press', () => {
      this.onButton({
        button: GamepadButtons.Start,
        pressed: true,
        value: 1,
      });
    });

    gamepad.on('start:release', () => {
      this.onButton({
        button: GamepadButtons.Start,
        pressed: false,
        value: 0,
      });
    });

    gamepad.start();
  }

  public get isConnected(): boolean {
    return this._isConnected;
  }

  public set isConnected(value: boolean) {
    this._isConnected = value;
  }
}
