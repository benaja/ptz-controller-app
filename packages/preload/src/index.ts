/**
 * @module preload
 */

// Custom APIs for renderer

export {
  updateSelectedGamepad,
  getSelectedGamepad,
  newCammeraConnected,
  onGamepadEvent,
  getConnectedGamepads,
  gamepadEvent,
  onSystemResume,
} from './gamepadApi';
export { addCamera, removeCamera, updateCamera, getCameras, getCamera } from './cameraApi';
export { sha256sum } from './nodeCrypto';
export { versions } from './versions';
