import { IVideoMixer } from '@main/core';

export interface IMacroToggleSpecialFunctionCondition {
  isActive(mixer: IVideoMixer): Promise<boolean>;
}
