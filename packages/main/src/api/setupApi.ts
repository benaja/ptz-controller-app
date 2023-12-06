import { ipcMain } from 'electron';
import { GamepadApi } from './gamepadApi';

export function registerEndpoints(obj: any) {
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).filter(
    (m) => m !== 'constructor' && typeof obj[m] === 'function' && m.includes('Endpoint')
  );

  console.log('Registering endpoints...', methods);

  methods.forEach((method) => {
    const endpointName = method.replace('Endpoint', '');
    console.log(`Registering endpoint: ${endpointName}`);
    ipcMain.handle(endpointName, (event, args) => {
      return obj[method](args);
    });
  });
}

export function setupApi(mainWindow: Electron.BrowserWindow) {
  const api = new GamepadApi(mainWindow);
  registerEndpoints(api);
}
