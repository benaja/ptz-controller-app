import { z } from 'zod';
import { IDisposable } from '../GenericFactory/IDisposable';
import { CameraConnectionType } from './CameraConnectionTypes';
import { CameraPosition } from './ArduinoPtzCamera/AurduinoPtzCameraState';

export const baseCameraConfigSchema = z.object({
  id: z.string().uuid(),
  number: z.number(),
  type: z.nativeEnum(CameraConnectionType),
  source: z.string(),
});

export type BaseCameraConfig = z.infer<typeof baseCameraConfigSchema>;

export interface ICameraConnection extends IDisposable {
  readonly displayName: string;
  readonly type: CameraConnectionType;

  readonly connectionString: string;
  readonly number: number;

  readonly connected: boolean;

  readonly sourceId: string;

  /**
   * Set the pan speed of the camera.
   * @param value The speed of pan in the value range of [-1 .. 1] where
   * -1 represents maximum speed left and 1 represents maximum speed right
   */
  pan(value: number): void;
  /**
   * Set the tilt speed of the camera.
   * @param value The speed of tilt in the value range of [-1 .. 1] where
   * -1 represents maximum speed down and 1 represents maximum speed up
   */
  tilt(value: number): void;
  /**
   * Set the zoom speed of the camera.
   * @param value The speed of zoom in the value range of [-1 .. 1] where
   * -1 represents maximum speed out and 1 represents maximum speed in
   */
  zoom(value: number): void;
  /**
   * Set the focus speed of the camera.
   * @param value The speed of zoom in the value range of [-1 .. 1] where
   * -1 represents maximum speed out and 1 represents maximum speed in
   */
  focus(value: number): void;

  /**
   * Toggle the auto focus of the camera.
   * Because the LANC protocol doesnt support reading the current state of the
   * autofocus, we can only toggle it and not set it to a specific state.
   */
  toggleAutoFocus(): void;

  setAutoFocus(value: boolean): void;

  /**
   * Set the tally light of the camera.
   * @param state the state of the tally light. Can be 'preview', 'live' or ''
   */
  setTally(state: 'preview' | 'live' | ''): void;

  getPosition(): Promise<CameraPosition>;

  goToPosition(position: { pan: number; tilt: number; speed: number }): void;
}
