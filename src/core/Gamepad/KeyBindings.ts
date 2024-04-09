import { CutInputAction } from './actions/CutInputAction';
import { FocusCameraAction } from './actions/FocusCameraAction';
import { GetCurrentPositionAction } from './actions/GetCurrentPositionAction';
import { NextInputAction } from './actions/NextInputAction';
import { PanCameraAction } from './actions/PanCameraAction';
import { PreviousInputAction } from './actions/PreviousInputAction';
import {
  SetActiveCameraToOnAirAction,
  SetActiveCameraToPreviewAction,
} from './actions/SetActiveCameraAction';
import { TiltCameraAction } from './actions/TiltCameraAction';
import { ToggleAutofocusAction } from './actions/ToggleAutofocusAction';
import { ToggleTallyAction } from './actions/ToggleTallyAction';
import { ZoomCameraAction } from './actions/ZoomCameraAction';

export enum GamepadButtons {
  A = 0, // Cross
  B = 1, // Circle
  Y = 3, // Triangle
  X = 2, // Square
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

export const defaultKeyBindings: Record<string, GamepadButtons | GamepadAxis> = {
  [TiltCameraAction.name]: GamepadAxis.LeftStickY,
  [PanCameraAction.name]: GamepadAxis.LeftStickX,
  [ZoomCameraAction.name]: GamepadAxis.RightStickY,
  [FocusCameraAction.name]: GamepadAxis.RightStickX,

  [ToggleAutofocusAction.name]: GamepadButtons.A,
  [ToggleTallyAction.name]: GamepadButtons.X,
  // [PreviousInputAction.name]: GamepadButtons.LeftBumper,
  // [NextInputAction.name]: GamepadButtons.RightBumper,
  [CutInputAction.name]: GamepadButtons.B,
  [GetCurrentPositionAction.name]: GamepadButtons.Y,

  [SetActiveCameraToOnAirAction.name]: GamepadButtons.RightBumper,
  [SetActiveCameraToPreviewAction.name]: GamepadButtons.LeftBumper,
};

export const defaultSecondaryKeyBindings: Record<string, GamepadButtons | GamepadAxis> = {};
