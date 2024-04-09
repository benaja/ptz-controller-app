import Layout from '@renderer/Layout';
import Container from '../ui/Container';
import { useEffect, useState } from 'react';
import AppButton from '../ui/AppButton';
import { useNavigate, useParams } from 'react-router-dom';
import CameraForm, { CameraFormType } from './CameraForm';
import { CameraConnectionType } from '@core/CameraConnection/CameraConnectionTypes';
import { CameraConfig } from '@core/CameraConnection/ArduinoPtzCameraBuilder';

export default function EditCamera() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const [camera, setCamera] = useState<CameraConfig | null>(null);

  const [form, setForm] = useState<CameraFormType>({
    type: CameraConnectionType.ArduinoPtzCamera,
    ip: '',
    number: 0,
  });

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) return;

    window.cameraApi
      .updateCamera({
        ...form,
        id,
      })
      .then(() => {
        setForm({
          type: CameraConnectionType.ArduinoPtzCamera,
          ip: '',
          number: 0,
        });

        navigate('/cameras');
      });
  }

  function deleteCamera() {
    if (!id) return;

    window.cameraApi.removeCamera(id).then(() => {
      navigate('/cameras');
    });
  }

  useEffect(() => {
    if (!id) return;
    window.cameraApi.getCamera(id).then((camera) => {
      if (!camera) {
        throw new Error('Camera not found');
      }
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
