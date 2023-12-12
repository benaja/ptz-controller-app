import { VideoMixerConfig } from '@main/store/userStore';
import { ipcRenderer } from 'electron';
import { VideoMixerOption } from '@main/api/videoMixerApi';

export const getSelectedVideoMixer = (): Promise<VideoMixerConfig> =>
  ipcRenderer.invoke('getSelectedVideoMixer');

export const updateSelectedVideoMixer = (value: VideoMixerConfig): Promise<void> =>
  ipcRenderer.invoke('updateSelectedVideoMixer', value);

export const getAvailableVideoMixers = (): Promise<VideoMixerOption[]> =>
  ipcRenderer.invoke('getAvailableVideoMixers');
