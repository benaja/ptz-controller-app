import { GamepadType } from '@core/api/GamepadType';
import Select from '../ui/Select';
import TextField from '../ui/TextField';
import { useEffect, useState } from 'react';
import { GamepadResponse } from '@core/api/GamepadConfigApi';
import { ConnectedGamepadResponse } from '@core/api/ConnectedGamepadApi';

export type GamepadFormType = {
  name: string;
  type: GamepadType;
  videoMixerId: string | null;
  gamepadId: string | null;
};

type Props = {
  form: GamepadFormType;
  onChange: (form: GamepadFormType) => void;
  original?: GamepadResponse | null;
};

export default function GamepadForm({ form, onChange, original }: Props) {
  const [videoMixers, setVideoMixers] = useState<Array<{ label: string; value: string }>>([]);
  const [connectedGamepads, setConnectedGamepads] = useState<ConnectedGamepadResponse[]>([]);

  const availabelGamepads = connectedGamepads
    .filter((g) => !g.inUse || g.id === original?.gamepadId)
    .map((c) => ({
      value: c.id,
      label: c.name,
    }));

  const gamepadTypes = [
    {
      label: 'Web',
      value: GamepadType.WebApi,
    },
    {
      label: 'Sony PS4 Node HID',
      value: GamepadType.SonyPs4,
    },
    {
      label: 'Logitech F310 Node HID',
      value: GamepadType.LogitechN310,
    },
  ];

  function set(name: keyof GamepadFormType, value: string | number | null) {
    onChange({
      ...form,
      [name]: value,
    });
  }

  function fetchVideoMixers() {
    window.videoMixerApi.getVideoMixers().then((mixers) => {
      setVideoMixers(
        mixers.map((m) => ({
          value: m.id,
          label: m.name,
        })),
      );
    });
  }

  function fetchConnectedGamepads() {
    window.connectedGamepadApi.getConnectedGamepads().then((gamepads) => {
      setConnectedGamepads(gamepads);
    });
  }

  useEffect(() => {
    fetchVideoMixers();
    fetchConnectedGamepads();

    const interval = setInterval(() => {
      fetchConnectedGamepads();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Select
        label="Gamepad type"
        items={gamepadTypes}
        value={form.type}
        onChange={(type) => set('type', type)}
      />

      <TextField
        label="Name"
        value={form.name}
        onChange={(name) => set('name', name)}
        required
      />

      <Select
        label="Gamepad"
        value={form.gamepadId}
        items={availabelGamepads}
        onChange={(value) => set('gamepadId', value)}
      />

      <Select
        label="Video Mixer"
        value={form.videoMixerId}
        items={videoMixers}
        onChange={(value) => set('videoMixerId', value)}
      />
    </>
  );
}
