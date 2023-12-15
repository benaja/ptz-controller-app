import { GamepadType } from '@core/api/GamepadType';
import Select from '../ui/Select';
import TextField from '../ui/TextField';
import { useEffect, useState } from 'react';
import { GamepadResponse } from '@core/api/gamepadConfigApi';
import { ConnectedGamepadResponse } from '@core/api/ConnectedGamepadApi';

export type GamepadFormType = {
  name: string;
  type: GamepadType;
  videoMixerId: string | null;
  connectionIndex: number | null;
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
    .filter((g) => !g.isUse || g.connectionIndex === original?.connectionIndex)
    .map((c) => ({
      value: c.connectionIndex,
      label: c.id,
    }));
  const gamepadTypes = [
    {
      label: 'Web',
      value: GamepadType.WebApi,
    },
    {
      label: 'Node hid',
      value: GamepadType.NodeHid,
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
      console.log('connectedGamepads', gamepads);
      setConnectedGamepads(gamepads);
    });
  }

  useEffect(() => {
    fetchVideoMixers();
    fetchConnectedGamepads();
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
        value={form.connectionIndex}
        items={availabelGamepads}
        onChange={(value) => set('connectionIndex', value)}
        required
      />

      <Select
        label="Video Mixer"
        value={form.videoMixerId}
        items={videoMixers}
        onChange={(value) => set('videoMixerId', value)}
        required
      />
    </>
  );
}
