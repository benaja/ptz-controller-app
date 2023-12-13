import { VideoMixerConfig, userConfigStore } from '@main/store/userStore';
import { IVideoMixer } from './IVideoMixer';
import { eventEmitter } from '@main/events/eventEmitter';

let videoMixerHandler: VideoMixHanlder | null = null;

export function setupVideoMixHandler(availableVideoMixers: IVideoMixer[]) {
  if (videoMixerHandler) {
    throw new Error('VideoMixerHandler already initialized');
  }

  videoMixerHandler = new VideoMixHanlder(availableVideoMixers);
}

export function useVideoMixHanlder() {
  if (!videoMixerHandler) {
    throw new Error('VideoMixerHandler not initialized');
  }

  return videoMixerHandler;
}

export function getVideoMixer() {
  return useVideoMixHanlder().currentMixer();
}

export class VideoMixHanlder {
  _currentVideoMixer: IVideoMixer | null = null;

  constructor(private availableVideoMixers: IVideoMixer[]) {
    const currentVideoMixer = userConfigStore.get('videoMixer');
    this.setupVideoMixer(currentVideoMixer);

    eventEmitter.on('videoMixerUpdated', this.setupVideoMixer.bind(this));
  }

  currentMixer() {
    return this._currentVideoMixer;
  }

  setupVideoMixer(config: VideoMixerConfig) {
    if (this._currentVideoMixer) {
      this._currentVideoMixer.disconnect();
    }
    if (!config.ip || !config.name) return;

    this._currentVideoMixer = this.availableVideoMixers.find((f) => f.name === config.name) || null;

    if (!this._currentVideoMixer) {
      console.error(`VideoMixer ${config.name} not found`);
      return;
    }

    this._currentVideoMixer.connect(config);
  }

  public getAvailableVideoMixers() {
    return this.availableVideoMixers;
  }
}
