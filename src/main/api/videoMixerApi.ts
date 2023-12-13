import { useVideoMixHanlder } from '@main/VideoMixer/VideoMixHanlder';
import { eventEmitter } from '@main/events/eventEmitter';
import { VideoMixerConfig, userConfigStore } from '@main/store/userStore';

export type VideoMixerOption = {
  name: string;
  label: string;
};

export class VideoMixerApi {
  getSelectedVideoMixerEndpoint(): VideoMixerConfig {
    return userConfigStore.get('videoMixer');
  }

  updateSelectedVideoMixerEndpoint(videoMixer: VideoMixerConfig) {
    eventEmitter.emit('videoMixerUpdated', videoMixer);

    userConfigStore.set('videoMixer', videoMixer);
  }

  getAvailableVideoMixersEndpoint(): VideoMixerOption[] {
    return useVideoMixHanlder()
      .getAvailableVideoMixers()
      .map((vm) => ({
        name: vm.name,
        label: vm.label,
      }));
  }
}
