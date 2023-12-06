import Layout from '@renderer/Layout';
import Container from '../ui/Container';
import { useEffect, useState } from 'react';
import { addCamera, getCamera, getCameras, removeCamera, updateCamera } from '#preload';
import { CameraConfig } from '@main/store/userStore';
import AppButton from '../ui/AppButton';
import TextField from '../ui/TextField';
import { useNavigate, useParams } from 'react-router-dom';
import CameraForm from './CameraForm';

export default function EditCamera() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const [camera, setCamera] = useState<CameraConfig | null>(null);

  const [form, setForm] = useState({
    name: '',
    ip: '',
    port: 3001,
    number: 0,
  });

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) return;

    updateCamera({
      ...form,
      id,
    }).then(() => {
      setForm({
        name: '',
        ip: '',
        port: 3001,
        number: 0,
      });

      navigate('/cameras');
    });
  }

  function deleteCamera() {
    if (!id) return;

    removeCamera(id).then(() => {
      navigate('/cameras');
    });
  }

  useEffect(() => {
    if (!id) return;
    getCamera(id).then((camera) => {
      setCamera(camera);
      setForm(camera);
    });
  }, []);

  return (
    <Layout title="Edit camera">
      <Container>
        <form
          className="py-2 space-y-4"
          onSubmit={submit}
        >
          <CameraForm
            form={form}
            onChange={(newForm) => setForm(newForm)}
          />
          <div className="flex mt-6">
            <AppButton
              className="border-red-300 text-red-600"
              onClick={deleteCamera}
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
    </Layout>
  );
}
