import { IVideoMixer } from '@main/core';

export interface ISpecialFunction {
  run(mixer: IVideoMixer): void;
}
