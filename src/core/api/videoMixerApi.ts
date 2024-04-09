import { VideomixerFactory } from '@core/VideoMixer/VideoMixerFactory';
import { randomUUID } from 'crypto';

export class VideoMixerApi {
  constructor(private _videoMixerFacotry: VideomixerFactory) {}

  getVideoMixers() {
    return this._videoMixerFacotry.store.get('videoMixers').map((vm) => ({
      ...vm,
      connected: this._videoMixerFacotry.get(vm.id)?.isConnected ?? false,
    }));
  }

  getVideoMixer(id: string) {
    return this._videoMixerFacotry.store.get('videoMixers').find((vm) => vm.id === id);
  }

  async addVideoMixer(
    data: Omit<(typeof this._videoMixerFacotry.store.data.videoMixers)[0], 'id'>,
  ) {
    const schema = this._videoMixerFacotry.validationSchema(data.type);

    schema.omit({ id: true }).parse(data);

    const videoMixers = this._videoMixerFacotry.store.get('videoMixers');
    const newVideoMixer = {
      ...data,
      id: randomUUID() as string,
    } as (typeof videoMixers)[0];
    videoMixers.push(newVideoMixer);

    this._videoMixerFacotry.store.set('videoMixers', videoMixers);
    await this._videoMixerFacotry.add(newVideoMixer);

    return newVideoMixer;
  }

  async updateVideoMixer(videoMixer: (typeof this._videoMixerFacotry.store.data.videoMixers)[0]) {
    const videoMixers = this._videoMixerFacotry.store.get('videoMixers');
    const index = videoMixers.findIndex((vm) => vm.id === videoMixer.id);
    if (index === -1) return;
    videoMixers.splice(index, 1, videoMixer);
    this._videoMixerFacotry.store.set('videoMixers', videoMixers);

    await this._videoMixerFacotry.remove(videoMixer.id);
    await this._videoMixerFacotry.add(videoMixer);
  }

  async removeVideoMixer(id: string) {
    const videoMixers = this._videoMixerFacotry.store.get('videoMixers');
    const index = videoMixers.findIndex((vm) => vm.id === id);
    const videoMixer = videoMixers[index];

    if (index === -1) return;
    videoMixers.splice(index, 1);
    this._videoMixerFacotry.store.set('videoMixers', videoMixers);

    await this._videoMixerFacotry.remove(videoMixer.id);
  }

  async getScources() {
    const videoMixer = this._videoMixerFacotry.instances[0];
    if (!videoMixer) return [];

    return await videoMixer.getSources();
  }
}
