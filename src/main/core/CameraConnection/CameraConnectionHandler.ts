import { CameraConfig, userConfigStore } from '@main/store/userStore';
import { eventEmitter } from '@main/events/eventEmitter';
import { IDisposable } from '../GenericFactory/IDisposable';
import { useVideoMixHanlder } from '@main/VideoMixer/VideoMixHanlder';

let connectionHanlder: CameraConnectionHandler | null = null;

export function setupCameraConnectionHandler(): CameraConnectionHandler {
  if (connectionHanlder) return connectionHanlder;

  connectionHanlder = new CameraConnectionHandler();

  return connectionHanlder;
}

export function useCameraConnectionHandler(): CameraConnectionHandler {
  return connectionHanlder ?? setupCameraConnectionHandler();
}

export function getCurrentCameraConnection(): CameraConnection | undefined {
  return useCameraConnectionHandler().getCurrentCameraConnection();
}

export class CameraConnectionHandler implements IDisposable {
  private selectedCameraNumber: number | null = 1;

  private cameraConnections: Map<number, CameraConnection> = new Map();

  constructor() {
    const cameras = userConfigStore.get('cameras');

    cameras.forEach((camera) => {
      console.log('creating camera connection: ', camera);
      this.cameraConnections.set(camera.number, new CameraConnection(camera));
    });

    eventEmitter.on('cameraAdded', this.cameraAdded.bind(this));
    eventEmitter.on('cameraRemoved', this.cameraRemoved.bind(this));
    eventEmitter.on('cameraUpdated', this.cameraUpdated.bind(this));
  }

  public getCameraConnection(cameraNumber: number): CameraConnection | undefined {
    return this.cameraConnections.get(cameraNumber);
  }

  public getCurrentCameraConnection(): CameraConnection | undefined {
    const currentInput = useVideoMixHanlder().currentMixer()?.getPreview();

    if (currentInput == undefined) return;
    return this.cameraConnections.get(currentInput + 1);
  }

  private cameraAdded(camera: CameraConfig) {
    this.cameraConnections.set(camera.number, new CameraConnection(camera));
  }

  private cameraRemoved(camera: CameraConfig) {
    this.cameraConnections.get(camera.number)?.dispose();
    this.cameraConnections.delete(camera.number);
  }

  private cameraUpdated(camera: CameraConfig) {
    this.cameraConnections.get(camera.number)?.dispose();
    this.cameraConnections.set(camera.number, new CameraConnection(camera));
  }

  public dispose() {
    this.cameraConnections.forEach((connection) => {
      connection.dispose();
    });
    eventEmitter.off('cameraAdded', this.cameraAdded);
    eventEmitter.off('cameraRemoved', this.cameraRemoved);
    eventEmitter.off('cameraUpdated', this.cameraUpdated);
  }
}
