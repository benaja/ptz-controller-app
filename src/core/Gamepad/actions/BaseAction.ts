import { ICameraConnection } from '@core/CameraConnection/ICameraConnection';
import { IVideoMixer } from '@core/VideoMixer/IVideoMixer';

export type ActionParams = {
  getPreviewCamera: () => ICameraConnection | null;
  getOnAirCamera: () => ICameraConnection | null;
  getVideoMixer: () => IVideoMixer | null;
  getSelectedCamera: () => ICameraConnection | null;
  setSelectCamera: (camera: 'preview' | 'onAir') => void;
};
export abstract class BaseAction {
  constructor(protected params: ActionParams) {}

  async getPreviewCamera() {
    return this.params.getPreviewCamera();
  }

  async getOnAirCamera() {
    return this.params.getOnAirCamera();
  }

  async getVideoMixer() {
    return this.params.getVideoMixer();
  }

  async getSelectedCamera() {
    return this.params.getSelectedCamera();
  }
}

export interface IButtonAction {
  hanlde(value: 'pressed' | 'released'): void;

  onRelease?(): void;

  // onPress?(): void;

  onLongPress?(): void;
}

export interface IAxisAction {
  hanlde(value: number): void;
}

export abstract class ButtonAction extends BaseAction implements IButtonAction {
  protected timePresssed = 0;
  // timeout
  protected timeout: NodeJS.Timeout | null = null;

  hanlde(value: 'pressed' | 'released'): void {
    console.log('ButtonAction', value);
    if (value === 'released') {
      if (!this.timeout) return;

      clearTimeout(this.timeout);
      this.timeout = null;
      this.onRelease?.();
      return;
    }

    this.timePresssed = Date.now();

    this.onPress?.();

    if (this.onLongPress) {
      this.timeout = setTimeout(() => {
        this.timeout = null;
        this.onLongPress?.();
      }, 1000);
    }
  }

  onPress() {
    console.log('onPress');
  }

  onRelease() {}

  onLongPress() {}
}

export class AxisAction extends BaseAction implements IAxisAction {
  /**
   * @param value floating value of the axios between -1 and 1
   */
  hanlde(value: number): void {
    throw new Error('Method not implemented.');
  }

  previousValue = 0;

  /*
   * Convert the value to the correct range for the camera
   * Converts from the range -1 to 1 to the range -255 to 255
   */
  convertValue(value: number, muliplier = 255): number {
    if (value < 0.1 && value > -0.1) {
      return 0;
    }

    return Math.round(value * muliplier);
  }

  hasChanged(value: number): boolean {
    const hasChanged = value !== this.previousValue;
    this.previousValue = value;
    return hasChanged;
  }
}
