import { ipcRenderer } from 'electron';
import { CameraConfig } from '@main/store/userStore';

export const addCamera = (args: Omit<CameraConfig, 'id'>): Promise<void> =>
  ipcRenderer.invoke('addCamera', args);

export const removeCamera = (id: string): Promise<void> => ipcRenderer.invoke('removeCamera', id);

export const updateCamera = (args: CameraConfig): Promise<void> =>
  ipcRenderer.invoke('updateCamera', args);

export const getCameras = (): Promise<CameraConfig[]> => ipcRenderer.invoke('getCameras');

export const getCamera = (id: string): Promise<CameraConfig> => ipcRenderer.invoke('getCamera', id);
