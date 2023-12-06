import { ipcMain } from 'electron';
import { userConfigStore } from './store';
import { UserConfig } from './userConfig';
// import { Core } from './core';

export function setupApi(): void {
  ipcMain.handle('getUserConfig', (event, key: keyof UserConfig): UserConfig[keyof UserConfig] => {
    return userConfigStore.get(key);
  });
  ipcMain.handle(
    'setUserConfig',
    (event, key: keyof UserConfig, value: UserConfig[keyof UserConfig]): void => {
      userConfigStore.set(key, value);
    }
  );
  ipcMain.handle('getConnectedControllers', (event) => {
    // return core.cameraFactory.getCameras();
  });
}
