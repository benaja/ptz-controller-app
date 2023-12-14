import { Gamepad, GamepadEvent } from '@core/api/gamepadApi';
import { useEffect, useState } from 'react';
import Container from '../ui/Container';
import Layout from '@renderer/Layout';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function ManageGamepads() {
  const [connectedGamepads, setConnectedGamepads] = useState<Gamepad[]>([]);

  useEffect(() => {
    window.electronApi.getConnectedGamepads().then((gamepads) => {
      setConnectedGamepads(gamepads);
    });
  }, []);

  useEffect(() => {
    const removeGamepadEventListener = window.electronApi.onGamepadEvent(
      async (event, gamepadEvent: GamepadEvent) => {
        if (gamepadEvent.type === 'connected') {
          const gamepads = await window.electronApi.getConnectedGamepads();
          setConnectedGamepads(gamepads);
          console.log('gamepads', gamepads);
        }
        console.log('onGAmepadConnected', gamepadEvent);
      },
    );

    return () => {
      removeGamepadEventListener();
    };
  }, []);
  return (
    <Layout title="Gamepads">
      <p className="font-bold ml-2 mb-1 ">Input devices</p>
      <Container>
        {/* <h2 className="text-xl">Input devices</h2> */}

        <div className="divide-y">
          <Link
            to="/gamepads/primary"
            className="font-medium flex py-2 items-center"
          >
            <p className="font-medium">Primary</p>

            <ChevronRightIcon className="ml-auto h-4 w-4 text-gray-400" />
          </Link>
          <Link
            to="/gamepads/secondary"
            className="font-medium flex py-2 items-center"
          >
            <p className="font-medium">Secondary</p>

            <ChevronRightIcon className="ml-auto h-4 w-4 text-gray-400" />
          </Link>
        </div>
      </Container>
    </Layout>
  );
}
