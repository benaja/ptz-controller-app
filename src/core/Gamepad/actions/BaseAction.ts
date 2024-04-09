export interface IBaseAction {}

export interface IButtonAction extends IBaseAction {
  hanlde(value: 'pressed' | 'released'): void;
}

export interface IAxisAction extends IBaseAction {
  hanlde(value: number): void;
}

export class AxisAction implements IAxisAction {
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
