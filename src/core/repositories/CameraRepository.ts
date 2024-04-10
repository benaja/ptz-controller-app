import { arduinoPtzCameraSchema } from '@core/CameraConnection/ArduinoPtzCamera/ArduinoPtzCamera';
import { cgfPtzCameraSchema } from '@core/CameraConnection/CgfPtzCamera/CgfPtzCamera';
import { z } from 'zod';
import { Repository } from './Repository';

const cameraConfigSchema = z.discriminatedUnion('type', [
  arduinoPtzCameraSchema,
  cgfPtzCameraSchema,
]);
type CameraConfig = z.infer<typeof cameraConfigSchema>;

export class CameraRepository extends Repository<CameraConfig> {
  constructor() {
    super('camera', cameraConfigSchema);
  }
}
