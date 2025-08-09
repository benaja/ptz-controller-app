import { CameraFactory } from '@core/CameraConnection/CameraFactory';
import { CameraRepository } from '@core/repositories/CameraRepository';

export type CameraConfig = CameraRepository['items'][0];

export type CameraResponse = CameraConfig & { connected: boolean };

export class CameraApi {
  constructor(
    private _cameraConnectionFactory: CameraFactory,
    private _cameraRepository: CameraRepository,
  ) {}

  async addCamera(data: Omit<CameraConfig, 'id'>) {
    const camera = this._cameraRepository.add(data);

    await this._cameraConnectionFactory.add(camera);
  }

  async removeCamera(id: string) {
    this._cameraRepository.delete(id);
    await this._cameraConnectionFactory.remove(id);
  }

  async updateCamera(data: Partial<CameraConfig> & { id: string }) {
    const camera = this._cameraRepository.update(data.id, data);
    if (!camera) return;

    await this._cameraConnectionFactory.remove(data.id);
    await this._cameraConnectionFactory.add(camera);
  }

  getCameras(): CameraResponse[] {
    return this._cameraRepository.getAll().map((c) => ({
      ...c,
      connected: this._cameraConnectionFactory.getCameraConnection(c.sourceId)?.connected || false,
    }));
  }

  getCamera(id: string): CameraResponse | null {
    const camera = this._cameraRepository.getById(id);

    if (!camera) return null;

    console.log(this._cameraConnectionFactory.getCameraConnection(camera.sourceId));

    return {
      ...camera,
      connected:
        !!this._cameraConnectionFactory.getCameraConnection(camera.sourceId)?.connected || false,
    };
  }

  /**
   * Control pan/tilt for a specific camera by id. Values are expected in the range [-1 .. 1].
   */
  controlPanTiltEndpoint(args: { cameraId: string; pan: number; tilt: number }) {
    const cameraConfig = this._cameraRepository.getById(args.cameraId);
    if (!cameraConfig) return;

    const connection = this._cameraConnectionFactory.getCameraConnection(cameraConfig.sourceId);
    if (!connection) return;

    const panValue = this.#convertAxis(args.pan);
    const tiltValue = this.#convertAxis(args.tilt);

    connection.pan(panValue);
    // Invert tilt to match on-screen up/down feel similar to gamepad mapping
    connection.tilt(tiltValue === 0 ? 0 : -tiltValue);
  }

  /**
   * Control zoom for a specific camera by id. Value expected in the range [-1 .. 1].
   */
  controlZoomEndpoint(args: { cameraId: string; zoom: number }) {
    const cameraConfig = this._cameraRepository.getById(args.cameraId);
    if (!cameraConfig) return;

    const connection = this._cameraConnectionFactory.getCameraConnection(cameraConfig.sourceId);
    if (!connection) return;

    const zoomValue = this.#convertAxis(args.zoom, 8);
    connection.zoom(-zoomValue);
  }

  #convertAxis(value: number, multiplier = 255): number {
    // deadzone
    if (value < 0.1 && value > -0.1) return 0;
    // exponential curve for finer control near center
    const curved = value < 0 ? -Math.pow(-value, 3) : Math.pow(value, 3);
    return Math.round(curved * multiplier);
  }
}
