import Layout from '@renderer/Layout';
import Container from '../ui/Container';
import { useEffect, useState } from 'react';
import AppButton from '../ui/AppButton';
import { useNavigate } from 'react-router-dom';
import CameraForm from './CameraForm';
import { CameraConnectionType } from '@core/CameraConnection/CameraConnectionTypes';
import { parseErrorMessage } from '@renderer/lib/utils';
import { CameraConfig } from '@core/api/CameraApi1';

export default function AddCamera() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: CameraConnectionType.ArduinoPtzCamera,
    ip: '',
    number: 0,
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
          number: 0,
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
            // @ts-ignore
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
