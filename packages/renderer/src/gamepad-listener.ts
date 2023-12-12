import { Gamepad } from '@main/gamepad/gamepadApi';
import { GamepadListener } from 'gamepad.js';
import { gamepadEvent, onSystemResume } from '#preload';

function convertGamepad(gamepad: any): Gamepad {
  return {
    id: gamepad.id,
    connectionIndex: gamepad.index,
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

  gamepadEvent({
    type: 'updateGamepads',
    payload: navigator
      .getGamepads()
      .filter((g) => g)
      .map(convertGamepad),
  });

  gamepadEvent({
    type: 'connected',
    payload: convertGamepad(event.detail.gamepad),
  });
  // window.gamepadApi.onGamepadConnected(convertGamepad(event.detail.gamepad));
});
listener.on('gamepad:disconnected', (event) => {
  gamepadEvent({
    type: 'updateGamepads',
    payload: navigator
      .getGamepads()
      .filter((g) => g)
      .map(convertGamepad),
  });
  // console.log('Gamepad disconnected', event);
  gamepadEvent({
    type: 'disconnected',
    payload: convertGamepad(event.detail.gamepad),
  });
});
listener.on('gamepad:button', (event) => {
  console.log('Gamepad button event', event);
  gamepadEvent({
    type: 'button',
    payload: {
      button: event.detail.button,
      pressed: event.detail.pressed,
      value: event.detail.value,
      gamepad: convertGamepad(event.detail.gamepad),
    },
  });
});

listener.on('gamepad:axis', (event) => {
  console.log('Gamepad axis event', event);
  gamepadEvent({
    type: 'axis',
    payload: {
      axis: event.detail.axis,
      value: event.detail.value,
      gamepad: convertGamepad(event.detail.gamepad),
    },
  });
});

listener.start();

onSystemResume(() => {
  listener.stop();
  console.log('onSystemResume');
  listener.start();
});
