import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { GamepadEvent } from '@main/gamepad/gamepadApi';
import { UserConfig } from 'src/main/userConfig';
import { registerListener } from './utils';

// Custom APIs for renderer
const api = {
  getUserConfig: (key: keyof UserConfig): Promise<UserConfig[keyof UserConfig]> =>
    ipcRenderer.invoke('getUserConfig', key),
  setUserConfig: (key: keyof UserConfig, value: UserConfig[keyof UserConfig]): void =>
    ipcRenderer.send('setUserConfig', key, value),
  setSelectedGamepad: (args: { type: 'primary' | 'secondary'; id: string | null }): Promise<void> =>
    ipcRenderer.invoke('setSelectedGamepad', args),
  getSelectedGamepad: (args: { type: 'primary' | 'secondary' }): Promise<Gamepad | null> =>
    ipcRenderer.invoke('getSelectedGamepad', args),

  newCammeraConnected: (callback) => {
    return registerListener('newCammeraConnected', callback);
  },
  onGamepadEvent: (callback: (event: GamepadEvent) => void) => {
    return registerListener('onGamepadEvent', callback);
  },
  getConnectedGamepads: (): Promise<Gamepad[]> => ipcRenderer.invoke('getConnectedGamepads'),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
