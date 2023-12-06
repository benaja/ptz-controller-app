/**
 * @module preload
 */

import { ipcRenderer } from 'electron';
import { Gamepad, GamepadEvent } from '@main/gamepad/gamepadApi';
import { type UserConfig } from '@main/userConfig';
import { registerListener } from './utils';

// Custom APIs for renderer

export const getUserConfig = (key: keyof UserConfig): Promise<UserConfig[keyof UserConfig]> =>
  ipcRenderer.invoke('getUserConfig', key);
export const setUserConfig = (key: keyof UserConfig, value: UserConfig[keyof UserConfig]): void =>
  ipcRenderer.send('setUserConfig', key, value);
export const updateSelectedGamepad = (args: {
  type: 'primary' | 'secondary';
  connectionIndex: number | null;
}): Promise<void> => ipcRenderer.invoke('updateSelectedGamepad', args);
export const getSelectedGamepad = (args: {
  type: 'primary' | 'secondary';
}): Promise<Gamepad | null> => ipcRenderer.invoke('getSelectedGamepad', args);

export const newCammeraConnected = (callback) => {
  return registerListener('newCammeraConnected', callback);
};
export const onGamepadEvent = (callback: (event: GamepadEvent) => void) => {
  return registerListener('onGamepadEvent', callback);
};
export const getConnectedGamepads = (): Promise<Gamepad[]> =>
  ipcRenderer.invoke('getConnectedGamepads');

export const gamepadEvent = (event: GamepadEvent) => ipcRenderer.invoke('gamepadEvent', event);

export const onSystemResume = (callback: () => void) =>
  registerListener('onSystemResume', callback);

export { sha256sum } from './nodeCrypto';
export { versions } from './versions';
