import { z } from 'zod';
import { Factory } from '../GenericFactory/Factory';
import { ICameraConnection } from './ICameraConnection';
import { Store } from '@core/store';
import { arduinoPtzCameraSchema } from './ArduinoPtzCamera/ArduinoPtzCamera';
import { cgfPtzCameraSchema } from './CgfPtzCamera/CgfPtzCamera';

const cameraConfigSchema = z.union([arduinoPtzCameraSchema, cgfPtzCameraSchema]);

export class CameraFactory extends Factory<ICameraConnection> {
  public store = new Store({
    configName: 'camera',
    schema: z.object({
      cameras: z.array(cameraConfigSchema),
    }),
    defaults: {
      cameras: [],
    },
  });

  getCameraConnection(number: number): ICameraConnection | undefined {
    return Object.values(this._instances).find((c) => c.number === number);
  }
}
