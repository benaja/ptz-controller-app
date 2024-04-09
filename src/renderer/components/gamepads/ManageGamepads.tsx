import { useEffect, useState } from 'react';
import Container from '../ui/Container';
import Layout from '@renderer/Layout';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { ConnectedGamepadResponse } from '@core/api/ConnectedGamepadApi';
import { GamepadResponse } from '@core/api/GamepadConfigApi';
import AppButton from '../ui/AppButton';

export default function ManageGamepads() {
  const [connectedGamepads, setConnectedGamepads] = useState<ConnectedGamepadResponse[]>([]);
  const [gamepads, setGamepads] = useState<GamepadResponse[]>([]);

  useEffect(() => {
    window.connectedGamepadApi.getConnectedGamepads().then((gamepads) => {
      setConnectedGamepads(gamepads);
    });
    window.gamepadConfigApi.getGamepads().then((gamepads) => {
      setGamepads(gamepads);
    });
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
    <Layout title="Gamepads">
      <p className="font-bold ml-2 mb-1 ">Input devices</p>
      <Container>
        {/* <h2 className="text-xl">Input devices</h2> */}

        <div className="divide-y">
          {gamepads.map((gamepad) => (
            <Link
              key={gamepad.id}
              to={`/gamepads/${gamepad.id}`}
              className="font-medium flex py-2 items-center"
            >
              <p className="font-medium">{gamepad.name}</p>

              <ChevronRightIcon className="ml-auto h-4 w-4 text-gray-400" />
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
