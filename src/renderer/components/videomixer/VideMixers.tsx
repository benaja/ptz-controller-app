import Layout from '@renderer/Layout';
import { useEffect, useState } from 'react';
import AppButton from '../ui/AppButton';
import Container from '../ui/Container';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { VideoMixerApi } from '@core/api/videoMixerApi';

export default function VideoMixers() {
  const [videoMixers, setVideoMixers] = useState([] as ReturnType<VideoMixerApi['getVideoMixers']>);

  function fetchVideoMixers() {
    window.videoMixerApi.getVideoMixers().then((mixers) => {
      setVideoMixers(mixers);
    });
  }

  useEffect(() => {
    fetchVideoMixers();
  }, []);

  return (
    <Layout
      title="Video Mixer Configuration"
      actions={
        videoMixers.length ? <AppButton onClick={fetchVideoMixers}>Refresh</AppButton> : null
      }
    >
      <Container className="divide-y">
        {videoMixers.length === 0 && <p className="py-2">No video mixers</p>}
        {videoMixers.map((videoMixer) => (
          <Link
            key={videoMixer.id}
            to={`/video-mixers/${videoMixer.id}`}
            className="py-2 flex items-center gap-4"
          >
            <p>{videoMixer.name}</p>

            <span className="ml-auto  px-1 py-0 border-gray-200 border rounded">
              {videoMixer.connected ? 'connected' : 'disconnected'}
            </span>
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
          </Link>
        ))}
      </Container>

      <div className="flex mt-6">
        <AppButton
          className="ml-auto"
          to="/video-mixers/add"
        >
          Add video mixer
        </AppButton>
      </div>
    </Layout>
  );
}
