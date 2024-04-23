import { IDisposable } from './GenericFactory/IDisposable';
import { CameraFactory } from './CameraConnection/CameraFactory';
import { VideomixerFactory } from './VideoMixer/VideoMixerFactory';
import { GamepadFactory } from './Gamepad/GemepadFactory';
import { ConnectedGamepadApi } from './api/ConnectedGamepadApi';
import { GamepadConfigApi } from './api/GamepadConfigApi';
import { CameraApi } from './api/CameraApi';
import { VideoMixerApi } from './api/VideoMixerApi';
import { ConnectedGamepadStore } from './store/ConnectedGamepadsStore';
import { TallyHub } from './Tally/TallyHub';
import { CameraRepository } from './repositories/CameraRepository';
import { VideoMixerRepository } from './repositories/VideoMixerRepository';
import { GamepadRepository } from './repositories/GamepadRepository';
import { NotificationApi } from './api/NotificationApi';

export class Core implements IDisposable {
  public readonly cameraFactory: CameraFactory;
  public readonly mixerFactory: VideomixerFactory;
  public readonly gamepadFactory: GamepadFactory;

  public readonly gamepadConfigApi: GamepadConfigApi;
  public readonly connectedGamepadApi: ConnectedGamepadApi;
  public readonly cameraApi: CameraApi;
  public readonly videoMixerApi: VideoMixerApi;

  public readonly cameraRepository: CameraRepository;
  public readonly mixerRepository: VideoMixerRepository;
  public readonly gamepadRepository: GamepadRepository;

  public readonly notificationApi: NotificationApi;

  public readonly tallyController: TallyHub;

  private readonly connectedGamepadsStore = new ConnectedGamepadStore();

  constructor() {
    this.notificationApi = new NotificationApi();

    this.cameraRepository = new CameraRepository();
    this.mixerRepository = new VideoMixerRepository();
    this.gamepadRepository = new GamepadRepository();

    this.cameraFactory = new CameraFactory(this.cameraRepository);
    this.mixerFactory = new VideomixerFactory();
    this.gamepadFactory = new GamepadFactory();

    this.gamepadConfigApi = new GamepadConfigApi(
      this.gamepadFactory,
      this.connectedGamepadsStore,
      this.gamepadRepository,
    );
    this.connectedGamepadApi = new ConnectedGamepadApi(
      this.gamepadFactory,
      this.connectedGamepadsStore,
      this.gamepadRepository,
    );
    this.cameraApi = new CameraApi(this.cameraFactory, this.cameraRepository);
    this.videoMixerApi = new VideoMixerApi(this.mixerFactory, this.mixerRepository);
  }

  public async bootstrap(): Promise<void> {
    this.cameraFactory.build(this.cameraRepository.getAll());
    this.mixerFactory.build(this.mixerRepository.getAll());
  }

  public async dispose(): Promise<void> {
    await this.cameraFactory.dispose();
    await this.mixerFactory.dispose();
    await this.gamepadFactory.dispose();
  }
}
