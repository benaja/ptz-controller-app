import {contextBridge, ipcRenderer} from 'electron';
import {electronAPI} from '@electron-toolkit/preload';
import {registerListener} from './utils';

// Custom APIs for renderer

export const gamepadEvent = (event: GamepadEvent) => ipcRenderer.invoke('gamepadEvent', event);

export const onSystemResume = (callback: () => void) =>
  registerListener('onSystemResume', callback);
