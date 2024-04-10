import { CameraFactory, IBuilder, IHmi, VideomixerFactory } from '@core';
import { Dualshock4 } from './Dualshock4';
import { GamepadConfig } from '@core/repositories/GamepadRepository';

export class Dualshock4Builder implements IBuilder<IHmi> {
  constructor(private mixerFactory: VideomixerFactory, private cameraFactory: CameraFactory) {}
  supportedTypes(): Promise<string[]> {
    return Promise.resolve(['ps4/dualshock4']);
  }

  build(config: GamepadConfig): Promise<IHmi> {
    return Promise.resolve(new Dualshock4(config, this.mixerFactory, this.cameraFactory));
  }
}
