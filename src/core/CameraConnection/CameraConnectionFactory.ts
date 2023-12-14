import { Factory } from '../GenericFactory/Factory';
import { arduinoPtzCamera } from './ArduinoPtzCamera/ArduinoPtzCamera';
import { cgfPtzCamera } from './CgfPtzCamera/CgfPtzCamera';
import { ICameraConnection } from './ICameraConnection';

export class CameraConnectionFactory extends Factory<ICameraConnection> {
  public schemas = [cgfPtzCamera, arduinoPtzCamera];

  configSchemas() {
    return [cgfPtzCamera, arduinoPtzCamera];
  }

  getCameraConnection(number: number): ICameraConnection | undefined {
    return Object.values(this._instances).find((c) => c.number === number);
  }
}
