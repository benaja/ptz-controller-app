export interface IBaseAction {}

export interface IButtonAction extends IBaseAction {
  hanlde(value: 'pressed' | 'released'): void;
}

export interface IAxisAction extends IBaseAction {
  hanlde(value: number): void;
}

export class AxisAction implements IAxisAction {
  hanlde(value: number): void {
    throw new Error('Method not implemented.');
  }
}
