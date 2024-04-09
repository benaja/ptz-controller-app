import { ConnectedGamepad } from '@core/api/ConnectedGamepadApi';
import { GamepadListener } from 'gamepad.js';

/**
 *
 * When having multiple gamepads of the same type, the id is the same.
 * This function generates a unique id for each gamepad. Based on the index their are connected to.
 */
function getUniqueId(id: string, index: number) {
  const gamepads = navigator.getGamepads();
  const gamepadsWithSameId = gamepads.filter((g) => g && g.id === id);

  const relativeIndex = gamepadsWithSameId.findIndex((g) => g && g.index === index);
  return id + '-' + relativeIndex;
}

function convertGamepad(gamepad: any): ConnectedGamepad {
  return {
    name: gamepad.id,
    id: getUniqueId(gamepad.id, gamepad.index),
  };
}

const listener = new GamepadListener({
  axis: {
    precision: 2,
    deadZone: 0.02,
  },
});
listener.on('gamepad:connected', (event) => {
  console.log('Gamepad connected', event.detail.gamepad);
  console.log('all gamepads', navigator.getGamepads());

  window.connectedGamepadApi.updateConnectedGamepads(
    navigator
      .getGamepads()
      .filter((g) => g)
      .map(convertGamepad),
  );

  // window.electronApi.gamepadEvent({
  //   type: 'connected',
  //   payload: convertGamepad(event.detail.gamepad),
  // });
  // window.gamepadApi.onGamepadConnected(convertGamepad(event.detail.gamepad));
});
listener.on('gamepad:disconnected', (event) => {
  window.connectedGamepadApi.updateConnectedGamepads(
    navigator
      .getGamepads()
      .filter((g) => g)
      .map(convertGamepad),
  );
  // console.log('Gamepad disconnected', event);
  // window.electronApi.gamepadEvent({
  //   type: 'disconnected',
  //   payload: convertGamepad(event.detail.gamepad),
  // });
});
listener.on('gamepad:button', (event) => {
  console.log('Gamepad button event', event);
  window.connectedGamepadApi.triggerButtonEvent({
    button: event.detail.button,
    pressed: event.detail.pressed,
    value: event.detail.value,
    gamepad: convertGamepad(event.detail.gamepad),
  });
});

listener.on('gamepad:axis', (event) => {
  console.log('Gamepad axis event', event);
  window.connectedGamepadApi.triggerAxisEvent({
    axis: event.detail.axis,
    value: event.detail.value,
    gamepad: convertGamepad(event.detail.gamepad),
  });
});

listener.start();

// window.electronApi.onSystemResume(() => {
//   listener.stop();
//   console.log('onSystemResume');
//   listener.start();
// });
