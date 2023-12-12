import Layout from '@renderer/Layout';
import Container from '../ui/Container';
import { useEffect, useState } from 'react';
import { getCameras } from '#preload';
import { CameraConfig } from '@main/store/userStore';
import AppButton from '../ui/AppButton';
import { Link, NavLink } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { CameraResponse } from '@main/api/cameraApi';

export default function Cameras() {
  const [cameras, setCameras] = useState<CameraResponse[]>([]);

  function fetchCameras() {
    getCameras().then((cameras) => {
      setCameras(cameras);
      console.log('cameras', cameras);
    });
  }

  useEffect(() => {
    fetchCameras();
  }, []);

  return (
    <Layout
      title="Cameras"
      actions={<AppButton onClick={fetchCameras}>Refresh</AppButton>}
    >
      <Container className="divide-y">
        {cameras.length === 0 && <p className="py-2">No cameras connected</p>}
        {cameras.map((camera) => (
          <Link
            key={camera.id}
            to={`/cameras/${camera.id}`}
            className="py-2 flex items-center gap-4"
          >
            <p>{camera.number}</p>

            <span className="ml-auto  px-1 py-0 border-gray-200 border rounded">
              {camera.connected ? 'connected' : 'disconnected'}
            </span>
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
          </Link>
        ))}
      </Container>

      <div className="flex mt-6">
        <AppButton
          className="ml-auto"
          to="/cameras/add"
        >
          Add camera
        </AppButton>
      </div>
    </Layout>
  );
}
