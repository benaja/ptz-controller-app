// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// import { CameraApi } from '@core/api/CameraApi';
import { CameraApi } from '@core/api/CameraApi';
import { contextBridge, ipcRenderer } from 'electron';

function registerListener(channel: string, callback: (...args: any[]) => void) {
  ipcRenderer.on(channel, callback);

  // return a function to remove the listener
  return () => {
    ipcRenderer.removeListener(channel, callback);
  };
}

function registerEndpoints(endpoints: string[], listeners: string[] = []) {
  const api = listeners.reduce((acc, listener) => {
    acc[listener] = (callback) => registerListener(listener, callback);
    return acc;
  }, {});

  return endpoints.reduce((acc, endPoint) => {
    acc[endPoint] = (...args) =>
      ipcRenderer.invoke(endPoint, ...args).catch((e) => {
        const errorMessage = e.message;

        // Extract the JSON part of the message
        const jsonPart = errorMessage.replace(/Error invoking remote method '.*': /, '');

        console.log(jsonPart);

        throw JSON.parse(jsonPart);
      });

    return acc;
  }, api) as IElectronAPI;
}

contextBridge.exposeInMainWorld(
  'cameraApi',
  registerEndpoints(['addCamera', 'removeCamera', 'updateCamera', 'getCameras', 'getCamera']),
);

contextBridge.exposeInMainWorld(
  'connectedGamepadApi',
  registerEndpoints([
    'getConnectedGamepads',
    'gamepadConnected',
    'gamepadDisconnected',
    'updateConnectedGamepads',
    'triggerButtonEvent',
    'triggerAxisEvent',
  ]),
);

contextBridge.exposeInMainWorld(
  'gamepadConfigApi',
  registerEndpoints(['addGamepad', 'updateGamepad', 'removeGamepad', 'getGamepad', 'getGamepads']),
);

contextBridge.exposeInMainWorld(
  'videoMixerApi',
  registerEndpoints([
    'getVideoMixers',
    'getVideoMixer',
    'addVideoMixer',
    'updateVideoMixer',
    'removeVideoMixer',
    'getSources',
  ]),
);
