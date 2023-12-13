import {
  CameraConnectionHandler,
  useCameraConnectionHandler,
} from '@main/core/CameraConnection/CameraConnectionHandler';

export interface IBaseAction {}

export interface IButtonAction extends IBaseAction {
  hanlde(value: 'pressed' | 'released'): void;
}

export interface IAxisAction extends IBaseAction {
  hanlde(value: number): void;
}

export class AxisAction implements IAxisAction {
  cameraConnectionHanlder: CameraConnectionHandler;

  constructor() {
    this.cameraConnectionHanlder = useCameraConnectionHandler();
  }

  hanlde(value: number): void {
    throw new Error('Method not implemented.');
  }

  protected currentCameraConnection() {
    return this.cameraConnectionHanlder.getCurrentCameraConnection();
  }
}
