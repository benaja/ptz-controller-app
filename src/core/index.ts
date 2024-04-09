import { IDisposable } from './GenericFactory/IDisposable';
import { CameraConnectionFactory } from './CameraConnection/CameraConnectionFactory';
import { UserConfigStore } from './store/userStore';
import { VideomixerFactory } from './VideoMixer/VideoMixerFactory';
import { GamepadFactory } from './Gamepad/GemepadFactory';
import { ConnectedGamepadApi } from './api/ConnectedGamepadApi';
import { GamepadConfigApi } from './api/GamepadConfigApi';
import { CameraApi } from './api/CameraApi';
import { VideoMixerApi } from './api/videoMixerApi';
import { ConnectedGamepadStore } from './store/ConnectedGamepadsStore';

export class Core implements IDisposable {
  private _camFactory: CameraConnectionFactory;
  private _mixerFactory: VideomixerFactory;
  private _gamepadFactory: GamepadFactory;
  private readonly _connectedGamepadsStore = new ConnectedGamepadStore();

  public readonly gamepadConfigApi: GamepadConfigApi;
  public readonly connectedGamepadApi: ConnectedGamepadApi;
  public readonly cameraApi: CameraApi;
  public readonly videoMixerApi: VideoMixerApi;

  private _userConfigStore = new UserConfigStore();

  public get cameraFactory(): CameraConnectionFactory {
    return this._camFactory;
  }

  public get mixerFactory(): VideomixerFactory {
    return this._mixerFactory;
  }

  public get gamepadFactory(): GamepadFactory {
    return this._gamepadFactory;
  }

  public get userConfigStore(): UserConfigStore {
    return this._userConfigStore;
  }

  constructor() {
    this._camFactory = new CameraConnectionFactory();
    this._mixerFactory = new VideomixerFactory();
    this._gamepadFactory = new GamepadFactory();

    this.gamepadConfigApi = new GamepadConfigApi(
      this.gamepadFactory,
      this.userConfigStore,
      this._connectedGamepadsStore,
    );
    this.connectedGamepadApi = new ConnectedGamepadApi(
      this.gamepadFactory,
      this.userConfigStore,
      this._connectedGamepadsStore,
    );
    this.cameraApi = new CameraApi(this.cameraFactory, this.userConfigStore);
    this.videoMixerApi = new VideoMixerApi(this.mixerFactory, this.userConfigStore);
  }

  public async bootstrap(): Promise<void> {
    this.cameraFactory.build(this.userConfigStore.get('cameras'));
    this.mixerFactory.build(this.userConfigStore.get('videoMixers'));
    this.gamepadFactory.build(this.userConfigStore.get('gamepads'));
  }

  public async dispose(): Promise<void> {
    await this._camFactory.dispose();
    await this._mixerFactory.dispose();
    await this._gamepadFactory.dispose();
  }
}
