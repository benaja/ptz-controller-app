import { Factory } from '../GenericFactory/Factory';
import { arduinoPtzCameraSchema } from './ArduinoPtzCamera/ArduinoPtzCamera';
import { cgfPtzCamera } from './CgfPtzCamera/CgfPtzCamera';
import { ICameraConnection } from './ICameraConnection';

export class CameraConnectionFactory extends Factory<ICameraConnection> {
  public schemas = [cgfPtzCamera, arduinoPtzCameraSchema];

  getCameraConnection(number: number): ICameraConnection | undefined {
    // console.log('getCameraConnection', number, Object.values(this._instances)[0].number);
    return Object.values(this._instances).find((c) => c.number === number);
  }
}
