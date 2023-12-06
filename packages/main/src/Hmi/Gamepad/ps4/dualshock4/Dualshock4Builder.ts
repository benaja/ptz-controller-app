import { CameraConnectionFactory, IBuilder, IHmi, VideomixerFactory } from '@main/core';
import { Dualshock4 } from './Dualshock4';
import { CameraConfig } from '@/store/userStore';

export class Dualshock4Builder implements IBuilder<IHmi> {
  constructor(
    private mixerFactory: VideomixerFactory,
    private cameraFactory: CameraConnectionFactory,
  ) {}
  supportedTypes(): Promise<string[]> {
    return Promise.resolve(['ps4/dualshock4']);
  }

  build(config: CameraConfig): Promise<IHmi> {
    return Promise.resolve(new Dualshock4(config, this.mixerFactory, this.cameraFactory));
  }
}
