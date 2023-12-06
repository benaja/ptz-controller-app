import { ipcMain } from 'electron';
import { GamepadApi } from './gamepadApi';
import { CameraApi } from './cameraApi';

/**
 * Dynamically registers IPC (Inter-Process Communication) handlers based on the methods of the provided object.
 * It identifies and sets up methods ending with 'Endpoint' as IPC handlers for Electron's main process. This
 * facilitates communication between the main process and renderer processes. Each method's 'Endpoint' suffix is
 * removed to form the IPC channel's name.
 *
 * @param {Object} obj - The object whose methods are to be registered as IPC handlers. Each method intended for
 *                       IPC handling should end with 'Endpoint'.
 *
 * Example Usage:
 *
 * class IPCActions {
 *   fetchDataEndpoint(args) {
 *     // Handler code here
 *   }
 * }
 *
 * registerEndpoints(new IPCActions());
 *
 * // This will register 'fetchData' as IPC handler,
 * // associated with the 'fetchDataEndpoint' method.
 */
export function registerEndpoints(obj: any) {
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).filter(
    (m) => typeof obj[m] === 'function' && m.endsWith('Endpoint'),
  );

  methods.forEach((method) => {
    const endpointName = method.replace('Endpoint', '');
    ipcMain.removeHandler(endpointName);
    ipcMain.handle(endpointName, (event, args) => {
      return obj[method](args);
    });
  });
}

export function setupApi() {
  const apis = [new GamepadApi(), new CameraApi()];

  apis.forEach((api) => registerEndpoints(api));
}
