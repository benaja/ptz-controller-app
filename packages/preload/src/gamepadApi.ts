import { ipcRenderer } from 'electron';
import { Gamepad, GamepadEvent } from '@main/api/gamepadApi';
import { registerListener } from './utils';

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
export const onGamepadEvent = (callback: (event: any, gamepadEvent: GamepadEvent) => void) => {
  return registerListener('onGamepadEvent', callback);
};
export const getConnectedGamepads = (): Promise<Gamepad[]> =>
  ipcRenderer.invoke('getConnectedGamepads');

export const gamepadEvent = (event: GamepadEvent) => ipcRenderer.invoke('gamepadEvent', event);

export const onSystemResume = (callback: () => void) =>
  registerListener('onSystemResume', callback);
