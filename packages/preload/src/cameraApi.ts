import { ipcRenderer } from 'electron';
import { CameraConfig } from '@main/store/userStore';
import { CameraResponse } from '@main/api/cameraApi';

export const addCamera = (args: Omit<CameraConfig, 'id'>): Promise<void> =>
  ipcRenderer.invoke('addCamera', args);

export const removeCamera = (id: string): Promise<void> => ipcRenderer.invoke('removeCamera', id);

export const updateCamera = (args: CameraConfig): Promise<void> =>
  ipcRenderer.invoke('updateCamera', args);

export const getCameras = (): Promise<CameraResponse[]> => ipcRenderer.invoke('getCameras');

export const getCamera = (id: string): Promise<CameraResponse> =>
  ipcRenderer.invoke('getCamera', id);
