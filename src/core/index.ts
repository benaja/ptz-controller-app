import { IDisposable } from './GenericFactory/IDisposable';
import { CameraFactory } from './CameraConnection/CameraFactory';
import { UserConfigStore } from './store/userStore';
import { VideomixerFactory } from './VideoMixer/VideoMixerFactory';
import { GamepadFactory } from './Gamepad/GemepadFactory';
import { ConnectedGamepadApi } from './api/ConnectedGamepadApi';
import { GamepadConfigApi } from './api/GamepadConfigApi';
import { CameraApi } from './api/CameraApi';
import { VideoMixerApi } from './api/videoMixerApi';
import { ConnectedGamepadStore } from './store/ConnectedGamepadsStore';

export class Core implements IDisposable {
  public readonly cameraFactory: CameraFactory;
  public readonly mixerFactory: VideomixerFactory;
  public readonly gamepadFactory: GamepadFactory;

  public readonly gamepadConfigApi: GamepadConfigApi;
  public readonly connectedGamepadApi: ConnectedGamepadApi;
  public readonly cameraApi: CameraApi;
  public readonly videoMixerApi: VideoMixerApi;

  public readonly userConfigStore = new UserConfigStore();
  private readonly connectedGamepadsStore = new ConnectedGamepadStore();

  constructor() {
    this.cameraFactory = new CameraFactory();
    this.mixerFactory = new VideomixerFactory();
    this.gamepadFactory = new GamepadFactory();

    this.gamepadConfigApi = new GamepadConfigApi(this.gamepadFactory, this.connectedGamepadsStore);
    this.connectedGamepadApi = new ConnectedGamepadApi(
      this.gamepadFactory,
      this.connectedGamepadsStore,
    );
    this.cameraApi = new CameraApi(this.cameraFactory);
    this.videoMixerApi = new VideoMixerApi(this.mixerFactory);
  }

  public async bootstrap(): Promise<void> {
    this.cameraFactory.build(this.cameraFactory.store.get('cameras'));
    this.mixerFactory.build(this.mixerFactory.store.get('videoMixers'));
    // this.gamepadFactory.build(this.gamepadFactory.store.get('gamepads'));
  }

  public async dispose(): Promise<void> {
    await this.cameraFactory.dispose();
    await this.mixerFactory.dispose();
    await this.gamepadFactory.dispose();
  }
}
