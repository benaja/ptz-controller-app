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
    const onAir = await this._mixer.getOnAirSources();
    const preview = await this._mixer.getPreviewSources();

    const allSouces = await this._mixer.getSources();

    const notLiveSources = allSouces.filter(
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
  }, 100);
}
