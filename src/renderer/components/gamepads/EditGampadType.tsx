import Layout from '@renderer/Layout';
import { useParams } from 'react-router-dom';
import Container from '../ui/Container';
import { useEffect, useState } from 'react';
import { Gamepad, GamepadEvent } from '@core/api/gamepadApi';

export default function EditGampadType() {
  const { type } = useParams<{ type: string }>();
  const [connectedGamepads, setConnectedGamepads] = useState<Gamepad[]>([]);
  const [selectedGamepad, setSelectedGamepad] = useState<Gamepad | null>(null);

  function loadSelectedGamepad() {
    window.electronApi
      .getSelectedGamepad({
        type: type as 'primary' | 'secondary',
      })
      .then((gamepad) => {
        console.log('selectedGamepad', gamepad);
        setSelectedGamepad(gamepad);
      });
  }

  function loadGamepads() {
    window.electronApi.getConnectedGamepads().then((gamepads) => {
      console.log('gamepads', gamepads);
      loadSelectedGamepad();
      setConnectedGamepads(gamepads.filter((gamepad) => !gamepad.isUse));
      console.log('gamepads', gamepads);
    });
  }

  useEffect(() => {
    loadGamepads();
    loadSelectedGamepad();

    const removeGamepadEventListener = window.electronApi.onGamepadEvent(
      async (event, gamepadEvent: GamepadEvent) => {
        console.log('onGamepadEvent', gamepadEvent);
        if (gamepadEvent.type === 'updateGamepads') {
          loadGamepads();
        }
      },
    );

    return () => {
      removeGamepadEventListener();
    };
  }, []);

  function setSelectedGamepadId(connectionIndex: number | null) {
    window.electronApi
      .updateSelectedGamepad({
        type: type as 'primary' | 'secondary',
        connectionIndex,
      })
      .then(() => {
        loadSelectedGamepad();
        loadGamepads();
      });
  }

  return (
    <Layout title={`${type?.charAt(0).toUpperCase()}${type?.slice(1)} Gamepad`}>
      <p className="pl-2 font-medium text-sm mb-1">Selected device</p>
      <Container>
        <button
          className="py-2 flex justify-between gap-4 items-center relative group w-full"
          onClick={() => setSelectedGamepadId(null)}
        >
          {selectedGamepad ? (
            <>
              <p className="font-medium">{selectedGamepad.id}</p>
              <p className="text-gray-500">
                {selectedGamepad.connectionIndex >= 0 ? 'Connected' : 'Not Connected'}
              </p>

              <div className="hidden group-hover:block bg-white rounded px-2 py-0.5 border-gray-200 border absolute top-1 right-0">
                unselect
              </div>
            </>
          ) : (
            <p className="text-gray-600">No gamepad selected</p>
          )}
        </button>
        {/* <h2 className="text-xl">{type?.charAt(0).toUpperCase() + type?.slice(1)} Gamepad</h2> */}
      </Container>

      <p className="pl-2 font-medium text-sm mb-1 mt-4">Available devices</p>
      <Container>
        {connectedGamepads.length === 0 && (
          <div className="py-2">
            <p className="text-gray-600">No gamepad connected</p>
          </div>
        )}
        {connectedGamepads.map((gamepad) => (
          <button
            className="py-2 cursor-pointer group w-full relative text-left"
            key={`${gamepad.id}-${gamepad.connectionIndex}`}
            onClick={() => setSelectedGamepadId(gamepad.connectionIndex)}
          >
            <p className="text-gray-600">{gamepad.id}</p>

            <div className="hidden group-hover:block bg-white rounded px-2 py-0.5 border-gray-200 border absolute top-1 right-0">
              select
            </div>
          </button>
        ))}
        {/* <h2 className="text-xl">{type?.charAt(0).toUpperCase() + type?.slice(1)} Gamepad</h2> */}
      </Container>
    </Layout>
  );
}
