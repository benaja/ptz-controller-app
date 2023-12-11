export interface IBaseAction {
  name: string;
}

export interface IButtonAction extends IBaseAction {
  button: number;

  hanlde(): void;
}

export interface IAxisAction extends IBaseAction {
  hanlde(value: number): void;
}
