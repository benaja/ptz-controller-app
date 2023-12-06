import Layout from '@renderer/Layout';
import Container from '../ui/Container';
import { useEffect, useState } from 'react';
import { addCamera, getCameras } from '#preload';
import { CameraConfig } from '@main/store/userStore';
import AppButton from '../ui/AppButton';
import TextField from '../ui/TextField';
import { useNavigate } from 'react-router-dom';
import CameraForm from './CameraForm';

export default function AddCamera() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    ip: '',
    port: 3001,
    number: 0,
  });

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    addCamera(form).then(() => {
      setForm({
        name: '',
        ip: '',
        port: 3001,
        number: 0,
      });

      navigate('/cameras');
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
