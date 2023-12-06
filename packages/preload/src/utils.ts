import { ipcRenderer } from 'electron';

export function registerListener(channel: string, callback: (...args: any[]) => void) {
  ipcRenderer.on(channel, callback);

  // return a function to remove the listener
  return () => {
    ipcRenderer.removeListener(channel, callback);
  };
}
