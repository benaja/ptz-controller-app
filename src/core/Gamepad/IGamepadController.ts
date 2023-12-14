import { IDisposable } from '@core/GenericFactory/IDisposable';
import { AxisEventPayload, ButtonEventPayload } from '@core/api/gamepadApi';

export interface IGamepadController extends IDisposable {
  onAxis(axis: AxisEventPayload): void;
  onButton(button: ButtonEventPayload): void;
}
