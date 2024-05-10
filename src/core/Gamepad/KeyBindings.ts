import {
  CameraPosition1Action,
  CameraPosition2Action,
  CameraPosition3Action,
  CameraPosition4Action,
} from './actions/CameraPositionAction';
import { CutInputAction } from './actions/CutInputAction';
import { FocusCameraAction } from './actions/FocusCameraAction';
import { NextInputAction } from './actions/NextInputAction';
import { PanCameraAction } from './actions/PanCameraAction';
import { PreviousInputAction } from './actions/PreviousInputAction';
import {
  SetActiveCameraToOnAirAction,
  SetActiveCameraToPreviewAction,
} from './actions/SetActiveCameraAction';
import { TiltCameraAction } from './actions/TiltCameraAction';
import { ToggleAutofocusAction } from './actions/ToggleAutofocusAction';
import { ToggleOverlay1, ToggleOverlay2 } from './actions/ToggleOverlayActions';
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

export const defaultAxisBindings: Record<string, GamepadAxis> = {
  [TiltCameraAction.name]: GamepadAxis.LeftStickY,
  [PanCameraAction.name]: GamepadAxis.LeftStickX,
  [ZoomCameraAction.name]: GamepadAxis.RightStickY,
  [FocusCameraAction.name]: GamepadAxis.RightStickX,
};

export const defaultButtonBindings: Record<string, GamepadButtons[]> = {
  [ToggleAutofocusAction.name]: [GamepadButtons.RightStick],

  [ToggleOverlay1.name]: [GamepadButtons.Y],
  [ToggleOverlay2.name]: [GamepadButtons.X],
  // [PreviousInputAction.name]: [GamepadButtons.LeftBumper],
  // [NextInputAction.name]: [GamepadButtons.RightBumper],
  // [CutInputAction.name]: [GamepadButtons.B],

  // [SetActiveCameraToOnAirAction.name]: [GamepadButtons.RightBumper],
  // [SetActiveCameraToPreviewAction.name]: [GamepadButtons.LeftBumper],

  [CutInputAction.name]: [GamepadButtons.B],
  [NextInputAction.name]: [GamepadButtons.RightBumper],
  [PreviousInputAction.name]: [GamepadButtons.LeftBumper],

  [CameraPosition1Action.name]: [GamepadButtons.DPadUp],
  [CameraPosition2Action.name]: [GamepadButtons.DPadRight],
  [CameraPosition3Action.name]: [GamepadButtons.DPadDown],
  [CameraPosition4Action.name]: [GamepadButtons.DPadLeft],
};

export const defaultSecondaryKeyBindings: Record<string, GamepadButtons | GamepadAxis> = {};
