import { AxisEventPayload, ButtonEventPayload, Gamepad, GamepadEvent } from '@core/api/gamepadApi';

type ListenerTypes = {
  gamepadEvent: (gamepadEvent: GamepadEvent) => void;
  gamepadConnected: (gamepad: Gamepad) => void;
  gamepadDisconnected: (gamepad: Gamepad) => void;
  gamepadButtonEvent: (gamepadEvent: ButtonEventPayload) => void;
  gamepadAxisEvent: (gamepadEvent: AxisEventPayload) => void;

  cameraConnected: (cameraNumber: number) => void;
};

const listeners: { [K in keyof ListenerTypes]: Set<ListenerTypes[K]> } = {
  gamepadEvent: new Set<(gamepadEvent: GamepadEvent) => void>(),
  gamepadConnected: new Set<(gamepad: Gamepad) => void>(),
  gamepadDisconnected: new Set<(gamepad: Gamepad) => void>(),
  gamepadButtonEvent: new Set<(gamepadEvent: ButtonEventPayload) => void>(),
  gamepadAxisEvent: new Set<(gamepadEvent: AxisEventPayload) => void>(),

  cameraConnected: new Set<(cameraNumber: number) => void>(),
};

export function registerListener<K extends keyof ListenerTypes>(
  channel: K,
  callback: ListenerTypes[K],
): () => void {
  listeners[channel].add(callback);

  // Return a function to remove the listener
  return () => {
    listeners[channel].delete(callback);
  };
}

export function emit<K extends keyof ListenerTypes>(
  channel: K,
  ...args: Parameters<ListenerTypes[K]>
): void {
  listeners[channel]?.forEach((callback) => {
    // Spread the args to match the callback signature
    callback(...args);
  });
}
