import { IDisposable } from '@core/GenericFactory/IDisposable';
import { AxisEventPayload, ButtonEventPayload } from '@core/api/gamepadConfigApi';

export interface IGamepadController extends IDisposable {
  isConnected: boolean;
  connectionIndex: number;

  onAxis(axis: AxisEventPayload): void;
  onButton(button: ButtonEventPayload): void;
}
