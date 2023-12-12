import { FocusCameraAction } from './actions/FocusCameraAction';
import { PanCameraAction } from './actions/PanCameraAction';
import { TiltCameraAction } from './actions/TiltCameraAction';
import { ToggleAutofocusAction } from './actions/ToggleAutofocusAction';
import { ToggleTallyAction } from './actions/ToggleTallyAction';
import { ZoomCameraAction } from './actions/ZoomCameraAction';

export enum GamepadButtons {
  A = 0,
  B = 1,
  Y = 3,
  X = 2,
  LeftBumper = 4,
  RightBumper = 5,
  LeftTrigger = 6,
  RightTrigger = 7,
  Back = 8,
  Start = 9,
  LeftStick = 10,
  RightStick = 11,
  DPadUp = 12,
  DPadDown = 13,
  DPadLeft = 14,
  DPadRight = 15,
  Home = 16,
  Center = 17,
}

export enum GamepadAxis {
  LeftStickX = 0,
  LeftStickY = 1,
  RightStickX = 2,
  RightStickY = 3,
  // LeftTrigger = 4,
  // RightTrigger = 5,
}

export const defualtPrimaryKeyBindings: Record<string, GamepadButtons | GamepadAxis> = {
  [TiltCameraAction.name]: GamepadAxis.LeftStickY,
  [PanCameraAction.name]: GamepadAxis.LeftStickX,
  [ZoomCameraAction.name]: GamepadAxis.RightStickY,
  [FocusCameraAction.name]: GamepadAxis.RightStickX,

  [ToggleAutofocusAction.name]: GamepadButtons.A,
  [ToggleTallyAction.name]: GamepadButtons.B,
};

export const defaultSecondaryKeyBindings: Record<string, GamepadButtons | GamepadAxis> = {};
