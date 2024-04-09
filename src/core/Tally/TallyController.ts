import { debounce } from '@main/utils/debounce';
import { CameraFactory } from '@core/CameraConnection/CameraFactory';
import { VideomixerFactory } from '@core/VideoMixer/VideoMixerFactory';
import { registerListener } from '@core/events/eventBus';

export class TallyController {
  constructor(private _cameraFactory: CameraFactory, private _mixerFactory: VideomixerFactory) {
    registerListener('onAirSourceChanged', this.debounceTallyUpdate.bind(this));
    registerListener('previewSourceChanged', this.debounceTallyUpdate.bind(this));
  }

  debounceTallyUpdate = debounce(async () => {
    const mixer = this._mixerFactory.instances[0];
    if (!mixer) return;

    const onAir = await mixer.getOnAirSources();
    const preview = await mixer.getPreviewSources();

    const allSouces = await mixer.getSources();

    const notLiveSources = allSouces.filter(
      (source) =>
        !onAir.find((s) => s.id === source.id) && !preview.find((s) => s.id === source.id),
    );
    notLiveSources.forEach(async (source) => {
      this._cameraFactory.getCameraConnection(source)?.setTally('');
    });

    onAir.forEach(async (source) => {
      this._cameraFactory.getCameraConnection(source)?.setTally('live');
    });

    preview
      .filter((source) => !onAir.find((s) => s.id === source.id))
      .forEach(async (source) => {
        this._cameraFactory.getCameraConnection(source)?.setTally('preview');
      });
  }, 100);
}
