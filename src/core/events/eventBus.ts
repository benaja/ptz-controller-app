import { MixerSource } from '@core/VideoMixer/IVideoMixer';

type ListenerTypes = {
  previewSourceChanged: (source: MixerSource | null) => void;
  onAirSourceChanged: (source: MixerSource | null) => void;
  tallyUpdate: () => void;
};

const listeners: { [K in keyof ListenerTypes]: Set<ListenerTypes[K]> } = {
  previewSourceChanged: new Set<ListenerTypes['previewSourceChanged']>(),
  onAirSourceChanged: new Set<ListenerTypes['onAirSourceChanged']>(),
  tallyUpdate: new Set<ListenerTypes['tallyUpdate']>(),
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

export function removeListener<K extends keyof ListenerTypes>(
  channel: K,
  callback: ListenerTypes[K],
): void {
  listeners[channel].delete(callback);
}
