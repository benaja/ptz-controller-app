import { ConnectedGamepad } from '@core/api/ConnectedGamepadApi';

export class ConnectedGamepadStore {
  private _value: ConnectedGamepad[] = [];

  public get() {
    return this._value;
  }

  public set(value: ConnectedGamepad[]) {
    this._value = value;
  }
}
