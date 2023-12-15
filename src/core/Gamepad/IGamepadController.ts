import { IDisposable } from '@core/GenericFactory/IDisposable';
import { AxisEventPayload, ButtonEventPayload } from '@core/api/ConnectedGamepadApi';

export interface IGamepadController extends IDisposable {
  isConnected: boolean;
  connectionIndex: number;

  onAxis(axis: AxisEventPayload): void;
  onButton(button: ButtonEventPayload): void;
}
