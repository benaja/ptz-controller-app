import { VideomixerFactory } from '@core/VideoMixer/VideoMixerFactory';
import { VideoMixerRepository } from '@core/repositories/VideoMixerRepository';

export class VideoMixerApi {
  constructor(
    private _videoMixerFacotry: VideomixerFactory,
    private _mixerRepository: VideoMixerRepository,
  ) {}

  getVideoMixers() {
    return this._mixerRepository.getAll().map((vm) => ({
      ...vm,
      connected: this._videoMixerFacotry.get(vm.id)?.isConnected ?? false,
    }));
  }

  getVideoMixer(id: string) {
    return this._mixerRepository.getById(id);
  }

  async addVideoMixer(data: Omit<(typeof this._mixerRepository)['items'][0], 'id'>) {
    const mixer = this._mixerRepository.add(data);
    await this._videoMixerFacotry.add(mixer);

    return mixer;
  }

  async updateVideoMixer(data: (typeof this._mixerRepository)['items'][0]) {
    const videoMixer = this._mixerRepository.update(data.id, data);
    if (!videoMixer) return;

    await this._videoMixerFacotry.remove(videoMixer.id);
    await this._videoMixerFacotry.add(videoMixer);
  }

  async removeVideoMixer(id: string) {
    this._mixerRepository.delete(id);

    await this._videoMixerFacotry.remove(id);
  }

  async getScources() {
    const videoMixer = this._videoMixerFacotry.instances[0];
    if (!videoMixer) return [];

    return await videoMixer.getSources();
  }
}
