import Layout from '@renderer/Layout';
import Container from '../ui/Container';
import { useEffect, useState } from 'react';
import AppButton from '../ui/AppButton';
import { useNavigate, useParams } from 'react-router-dom';
import CameraForm, { CameraFormType } from './CameraForm';
import { CameraConnectionType } from '@core/CameraConnection/CameraConnectionTypes';
import { BaseCameraConfig } from '@core/CameraConnection/ICameraConnection';

export default function EditCamera() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const [form, setForm] = useState<CameraFormType>({
    type: CameraConnectionType.ArduinoPtzCamera,
    ip: '',
    name: '',
    connectionPort: null as string | null,
    sourceId: null as string | null,
    mixerId: null as string | null,
    isUpsideDown: false,
    maxSpeed: 100,
    minSpeed: 0,
  });

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) return;

    window.cameraApi
      .updateCamera({
        ...form,
        id,
      } as Partial<BaseCameraConfig> & { id: string })
      .then(() => {
        setForm({
          type: CameraConnectionType.ArduinoPtzCamera,
          ip: '',
          name: '',
          sourceId: null,
          mixerId: null,
          connectionPort: null,
          isUpsideDown: false,
          maxSpeed: 100,
          minSpeed: 0,
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
      setForm({
        ...camera,
        isUpsideDown: camera.isUpsideDown || false,
        maxSpeed: camera.maxSpeed || 100,
        minSpeed: camera.minSpeed || 0,
      });
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
