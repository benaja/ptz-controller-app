import { GamepadEvent } from '@/api/gamepadApi';

type ListenerTypes = {
  gamepadEvent: (gamepadEvent: GamepadEvent) => void;
};

const listeners: { [K in keyof ListenerTypes]: Set<ListenerTypes[K]> } = {
  gamepadEvent: new Set<(gamepadEvent: GamepadEvent) => void>(),
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
