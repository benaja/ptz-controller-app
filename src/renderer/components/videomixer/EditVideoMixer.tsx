import Layout from '@renderer/Layout';
import Container from '../ui/Container';
import { useEffect, useState } from 'react';
import AppButton from '../ui/AppButton';
import { useNavigate, useParams } from 'react-router-dom';
import VideoMixerForm, { VideoMixerFormType } from './VideoMixerForm';

export default function EditVideoMixer() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [form, setForm] = useState<VideoMixerFormType | null>(null);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!id || !form) return;

    window.videoMixerApi
      .updateVideoMixer({
        ...form,
        id,
      })
      .then(() => {
        navigate('/video-mixers');
      });
  }

  function getVideoMixer() {
    if (!id) return;
    window.videoMixerApi.getVideoMixer(id).then((videoMixer) => {
      if (!videoMixer) {
        throw new Error('Video mixer not found');
      }
      setForm(videoMixer);
    });
  }

  function deleteVideoMixer() {
    if (!id) return;

    window.videoMixerApi.removeVideoMixer(id).then(() => {
      navigate('/video-mixers');
    });
  }

  useEffect(() => {
    getVideoMixer();
  }, []);

  return (
    <Layout title="Edit Video mixer">
      {form && (
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
                className="border-red-300 text-red-600"
                onClick={deleteVideoMixer}
              >
                Delete
              </AppButton>
              <AppButton
                type="submit"
                className="ml-auto"
              >
                Save
              </AppButton>
            </div>
          </form>
        </Container>
      )}
    </Layout>
  );
}
