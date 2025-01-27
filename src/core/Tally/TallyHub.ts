import { debounce } from '@main/utils/debounce';
import { CameraFactory } from '@core/CameraConnection/CameraFactory';
import { registerListener } from '@core/events/eventBus';
import { IVideoMixer } from '@core/VideoMixer/IVideoMixer';
import { ITallyHub } from './ITallyHub';

export class TallyHub implements ITallyHub {
  constructor(private _cameraFactory: CameraFactory, private _mixer: IVideoMixer) {
    registerListener('onAirSourceChanged', this.debounceTallyUpdate.bind(this));
    registerListener('previewSourceChanged', this.debounceTallyUpdate.bind(this));
    registerListener('tallyUpdate', this.debounceTallyUpdate.bind(this));
  }

  public updateTally() {
    this.debounceTallyUpdate();
  }

  private debounceTallyUpdate = debounce(async () => {
    // Stop all camera movements
    this._cameraFactory.instances.forEach((camera) => {
      camera.pan(0);
      camera.tilt(0);
      camera.zoom(0);
    });

    const onAir = await this._mixer.getOnAirSources();
    const preview = await this._mixer.getPreviewSources();

    const allSources = await this._mixer.getSources();

    const notLiveSources = allSources.filter(
      (source) =>
        !onAir.find((s) => s.id === source.id) && !preview.find((s) => s.id === source.id),
    );
    notLiveSources.forEach(async (source) => {
      this._cameraFactory.getCameraConnection(source.id)?.setTally('');
    });

    onAir.forEach(async (source) => {
      this._cameraFactory.getCameraConnection(source.id)?.setTally('live');
    });

    preview
      .filter((source) => !onAir.find((s) => s.id === source.id))
      .forEach(async (source) => {
        this._cameraFactory.getCameraConnection(source.id)?.setTally('preview');
      });
  }, 10);
}
