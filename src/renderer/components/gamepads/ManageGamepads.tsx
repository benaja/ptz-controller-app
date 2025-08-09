import { useEffect, useState } from 'react';
import Container from '../ui/Container';
import Layout from '@renderer/Layout';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { ConnectedGamepadResponse } from '@core/api/ConnectedGamepadApi';
import { GamepadResponse } from '@core/api/GamepadConfigApi';
import AppButton from '../ui/AppButton';

export default function ManageGamepads() {
  const [gamepads, setGamepads] = useState<GamepadResponse[]>([]);

  useEffect(() => {
    fetchGamepads();
  }, []);

  function fetchGamepads() {
    window.gamepadConfigApi.getGamepads().then((gamepads) => {
      setGamepads(gamepads);
    });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchGamepads();
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // const removeGamepadEventListener = window.connectedGamepadApi.onGamepadEvent(
    //   async (event, gamepadEvent: GamepadEvent) => {
    //     if (gamepadEvent.type === 'connected') {
    //       const gamepads = await window.connectedGamepadApi.getConnectedGamepads();
    //       setConnectedGamepads(gamepads);
    //       console.log('gamepads', gamepads);
    //     }
    //     console.log('onGAmepadConnected', gamepadEvent);
    //   },
    // );

    return () => {
      // removeGamepadEventListener();
    };
  }, []);
  return (
    <Layout
      title="Gamepads"
      actions={<AppButton onClick={fetchGamepads}>Refresh</AppButton>}
    >
      <p className="mb-1 ml-2 font-bold ">Input devices</p>
      <Container>
        {/* <h2 className="text-xl">Input devices</h2> */}

        <div className="divide-y">
          {gamepads.map((gamepad) => (
            <Link
              key={gamepad.id}
              to={`/gamepads/${gamepad.id}`}
              className="flex py-2 font-medium"
            >
              <p className="font-medium">{gamepad.name}</p>

              <span className="px-1 py-0 ml-auto border border-gray-200 rounded">
                {gamepad.connected ? 'connected' : 'disconnected'}
              </span>

              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            </Link>
          ))}
          {gamepads.length === 0 && <p className="py-2 text-center text-gray-400">No gamepads</p>}
        </div>
      </Container>

      <div className="flex mt-6">
        <AppButton
          className="ml-auto"
          to="/gamepads/add"
        >
          Add Gamepad
        </AppButton>
      </div>
    </Layout>
  );
}
