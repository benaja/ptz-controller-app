import Layout from '@renderer/Layout';
import Container from '../ui/Container';
import { useEffect, useState } from 'react';
import AppButton from '../ui/AppButton';
import { useNavigate } from 'react-router-dom';
import CameraForm, { CameraFormType } from './CameraForm';
import { CameraConnectionType } from '@core/CameraConnection/CameraConnectionTypes';
import { parseErrorMessage } from '@renderer/lib/utils';
import { CameraConfig } from '@core/api/CameraApi';

export default function AddCamera() {
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    window.cameraApi

      .addCamera(form as CameraConfig)
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
      })
      .catch((e) => {
        setErrorMessage(parseErrorMessage(e));
      });
  }

  return (
    <Layout title="Add camera">
      <Container>
        <form
          className="py-2 space-y-4"
          onSubmit={submit}
        >
          <CameraForm
            form={form}
            onChange={(newForm) => setForm(newForm)}
          />

          {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}

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
