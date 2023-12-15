import Layout from '@renderer/Layout';
import Container from '../ui/Container';
import { useEffect, useState } from 'react';
import AppButton from '../ui/AppButton';
import { useNavigate } from 'react-router-dom';
import { CameraConnectionType } from '@core/CameraConnection/CameraConnectionTypes';
import { VideoMixerType } from '@core/VideoMixer/VideoMixerType';
import VideoMixerForm, { VideoMixerFormType } from './VideoMixerForm';

export default function AddVideoMixer() {
  const navigate = useNavigate();

  const [form, setForm] = useState<VideoMixerFormType>({
    type: VideoMixerType.OBS,
    name: '',
    ip: '',
    password: '',
    mixEffectBlock: 0,
  });

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    window.videoMixerApi.addVideoMixer(form).then(() => {
      setForm({
        type: VideoMixerType.OBS,
        name: '',
        ip: '',
        password: '',
        mixEffectBlock: 0,
      });

      navigate('/video-mixers');
    });
  }

  return (
    <Layout title="Add Video mixer">
      <Container>
        <form
          className="py-2 space-y-4"
          onSubmit={submit}
        >
          <VideoMixerForm
            form={form}
            onChange={(newForm) => setForm(newForm)}
          />
          <div className="flex mt-6">
            <AppButton
              type="submit"
              className="ml-auto"
            >
              Save
            </AppButton>
          </div>
        </form>
      </Container>
    </Layout>
  );
}
