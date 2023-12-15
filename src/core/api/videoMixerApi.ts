import { useVideoMixHanlder } from '@main/VideoMixer/VideoMixHanlder';
import { eventEmitter } from '@core/events/eventEmitter';
import { VideomixerFactory } from '@core/VideoMixer/VideoMixerFactory';
import { UserConfigStore } from '@core/store/userStore';
import { VideoMixerConfig } from '@core/VideoMixer/VideoMixerBuilder';
import { randomUUID } from 'crypto';

export type VideoMixerOption = {
  name: string;
  label: string;
};

export class VideoMixerApi {
  constructor(
    private _videoMixerFacotry: VideomixerFactory,
    private _userConfigStore: UserConfigStore,
  ) {}

  getVideoMixers(): VideoMixerConfig[] {
    return this._userConfigStore.get('videoMixers');
  }

  getVideoMixer(id: string): VideoMixerConfig | undefined {
    return this._userConfigStore.get('videoMixers').find((vm) => vm.id === id);
  }

  async addVideoMixer(videoMixer: Omit<VideoMixerConfig, 'id'>): Promise<VideoMixerConfig> {
    const videoMixers = this._userConfigStore.get('videoMixers');
    const newVideoMixer = {
      ...videoMixer,
      id: randomUUID(),
    } as VideoMixerConfig;
    videoMixers.push(newVideoMixer);
    this._userConfigStore.set('videoMixers', videoMixers);
    await this._videoMixerFacotry.add(newVideoMixer);

    return newVideoMixer;
  }

  async updateVideoMixer(videoMixer: VideoMixerConfig) {
    const videoMixers = this._userConfigStore.get('videoMixers');
    const index = videoMixers.findIndex((vm) => vm.id === videoMixer.id);
    if (index === -1) return;
    videoMixers.splice(index, 1, videoMixer);
    this._userConfigStore.set('videoMixers', videoMixers);

    await this._videoMixerFacotry.remove(videoMixer.id);
    await this._videoMixerFacotry.add(videoMixer);
  }

  async removeVideoMixer(id: string) {
    const videoMixers = this._userConfigStore.get('videoMixers');
    const index = videoMixers.findIndex((vm) => vm.id === id);
    const videoMixer = videoMixers[index];

    if (index === -1) return;
    videoMixers.splice(index, 1);
    this._userConfigStore.set('videoMixers', videoMixers);

    await this._videoMixerFacotry.remove(videoMixer.id);
  }
}
