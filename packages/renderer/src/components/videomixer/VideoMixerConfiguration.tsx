import Layout from '@/Layout';
import { VideoMixerConfig } from '@main/store/userStore';
import { useEffect, useState } from 'react';
import { getAvailableVideoMixers, getSelectedVideoMixer, updateSelectedVideoMixer } from '#preload';
import TextField from '../ui/TextField';
import Select from '../ui/Select';
import { VideoMixerType } from '@main/VideoMixer';
import AppButton from '../ui/AppButton';
import { VideoMixerOption } from '@main/api/videoMixerApi';

export default function VideoMixerConfiguration() {
  const [videoMixer, setVideoMixer] = useState<VideoMixerConfig | null>(null);
  const [availableVideoMixers, setAvailableVideoMixers] = useState<VideoMixerOption[]>([]);

  const videoMixerTypes = availableVideoMixers.map((videoMixer) => ({
    label: videoMixer.label,
    value: videoMixer.name,
  }));

  function fetchSelectedVideoMixer() {
    getSelectedVideoMixer().then((videoMixer) => {
      setVideoMixer(videoMixer);
    });
  }

  function fetchAvailableVideoMixers() {
    getAvailableVideoMixers().then((videoMixers) => {
      setAvailableVideoMixers(videoMixers);
    });
  }

  useEffect(() => {
    fetchSelectedVideoMixer();
    fetchAvailableVideoMixers();
  }, []);

  function set(name: keyof VideoMixerConfig, value: string | number) {
    if (!videoMixer) return;

    setVideoMixer({
      ...videoMixer,
      [name]: value,
    });
  }

  function updateVideoMixer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!videoMixer) return;

    updateSelectedVideoMixer(videoMixer);
  }

  return (
    <Layout title="Video Mixer Configuration">
      {videoMixer && (
        <form
          onSubmit={updateVideoMixer}
          className="space-y-5"
        >
          <Select
            items={videoMixerTypes}
            label="Mixer"
            value={videoMixer.name}
            onChange={(name) => set('name', name)}
          />

          <TextField
            label="Ip"
            value={videoMixer.ip}
            onChange={(ip) => set('ip', ip)}
            required
          />

          <TextField
            label="Password"
            value={videoMixer.password}
            onChange={(password) => set('password', password)}
          />

          <div className="flex">
            <AppButton onClick={fetchSelectedVideoMixer}>Cancel</AppButton>
            <AppButton
              type="submit"
              className="ml-auto"
            >
              Save
            </AppButton>
          </div>
        </form>
      )}
    </Layout>
  );
}
