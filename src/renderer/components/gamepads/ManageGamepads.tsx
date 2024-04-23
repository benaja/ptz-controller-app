import { useEffect, useState } from 'react';
import Container from '../ui/Container';
import Layout from '@renderer/Layout';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { ConnectedGamepadResponse } from '@core/api/ConnectedGamepadApi';
import { GamepadResponse } from '@core/api/GamepadConfigApi1';
import AppButton from '../ui/AppButton';

export default function ManageGamepads() {
  const [gamepads, setGamepads] = useState<GamepadResponse[]>([]);

  useEffect(() => {
    fetchGamepads();
  }, []);

  function fetchGamepads() {
    window.gamepadConfigApi.getGamepads().then((gamepads) => {
      setGamepads(gamepads);
      console.log(gamepads);
    });
  }

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
      <p className="font-bold ml-2 mb-1 ">Input devices</p>
      <Container>
        {/* <h2 className="text-xl">Input devices</h2> */}

        <div className="divide-y">
          {gamepads.map((gamepad) => (
            <Link
              key={gamepad.id}
              to={`/gamepads/${gamepad.id}`}
              className="font-medium flex py-2"
            >
              <p className="font-medium">{gamepad.name}</p>

              <span className="ml-auto  px-1 py-0 border-gray-200 border rounded">
                {gamepad.connected ? 'connected' : 'disconnected'}
              </span>

              <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            </Link>
          ))}
          {gamepads.length === 0 && <p className="text-gray-400 text-center py-2">No gamepads</p>}
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
