// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { IElectronAPI } from './preload.types';

function registerListener(channel: string, callback: (...args: any[]) => void) {
  ipcRenderer.on(channel, callback);

  // return a function to remove the listener
  return () => {
    ipcRenderer.removeListener(channel, callback);
  };
}

const endPoints: (keyof IElectronAPI)[] = [
  'updateSelectedGamepad',
  'getSelectedGamepad',
  'getConnectedGamepads',
  'gamepadEvent',
  'addCamera',
  'removeCamera',
  'updateCamera',
  'getCameras',
];
const listeners: (keyof IElectronAPI)[] = [
  'newCammeraConnected',
  'onGamepadEvent',
  'onSystemResume',
];

const api = listeners.reduce((acc, listener) => {
  acc[listener] = (callback) => registerListener(listener, callback);
  return acc;
}, {});

const electronApi = endPoints.reduce((acc, endPoint) => {
  acc[endPoint] = (...args) => ipcRenderer.invoke(endPoint, ...args);
  return acc;
}, api) as IElectronAPI;

contextBridge.exposeInMainWorld('electronApi', electronApi);
