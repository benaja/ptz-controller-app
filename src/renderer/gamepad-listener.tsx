// import { Gamepad } from '@main//api/gamepadApi';
// import { GamepadListener } from 'gamepad.js';

console.log('gamepad-listener.ts');

// function convertGamepad(gamepad: any): Gamepad {
//   return {
//     id: gamepad.id,
//     connectionIndex: gamepad.index,
//   };
// }

// const listener = new GamepadListener({
//   axis: {
//     precision: 2,
//     deadZone: 0.02,
//   },
// });
// listener.on('gamepad:connected', (event) => {
//   console.log('Gamepad connected', event.detail.gamepad);
//   console.log('all gamepads', navigator.getGamepads());

//   window.electronApi.gamepadEvent({
//     type: 'updateGamepads',
//     payload: navigator
//       .getGamepads()
//       .filter((g) => g)
//       .map(convertGamepad),
//   });

//   window.electronApi.gamepadEvent({
//     type: 'connected',
//     payload: convertGamepad(event.detail.gamepad),
//   });
//   // window.gamepadApi.onGamepadConnected(convertGamepad(event.detail.gamepad));
// });
// listener.on('gamepad:disconnected', (event) => {
//   window.electronApi.gamepadEvent({
//     type: 'updateGamepads',
//     payload: navigator
//       .getGamepads()
//       .filter((g) => g)
//       .map(convertGamepad),
//   });
//   // console.log('Gamepad disconnected', event);
//   window.electronApi.gamepadEvent({
//     type: 'disconnected',
//     payload: convertGamepad(event.detail.gamepad),
//   });
// });
// listener.on('gamepad:button', (event) => {
//   console.log('Gamepad button event', event);
//   window.electronApi.gamepadEvent({
//     type: 'button',
//     payload: {
//       button: event.detail.button,
//       pressed: event.detail.pressed,
//       value: event.detail.value,
//       gamepad: convertGamepad(event.detail.gamepad),
//     },
//   });
// });

// listener.on('gamepad:axis', (event) => {
//   console.log('Gamepad axis event', event);
//   window.electronApi.gamepadEvent({
//     type: 'axis',
//     payload: {
//       axis: event.detail.axis,
//       value: event.detail.value,
//       gamepad: convertGamepad(event.detail.gamepad),
//     },
//   });
// });

// listener.start();

// window.electronApi.onSystemResume(() => {
//   listener.stop();
//   console.log('onSystemResume');
//   listener.start();
// });
