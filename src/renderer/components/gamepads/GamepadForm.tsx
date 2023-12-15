import { GamepadType } from '@core/api/gamepadConfigApi';
import Select from '../ui/Select';
import TextField from '../ui/TextField';

export type GamepadFormType = {
  name: string;
  type: GamepadType;
  videMixerId: string;
};

type Props = {
  form: GamepadFormType;
  onChange: (form: GamepadFormType) => void;
};

export default function GamepadForm({ form, onChange }: Props) {
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

  function set(name: keyof GamepadFormType, value: string | number) {
    onChange({
      ...form,
      [name]: value,
    });
  }

  return (
    <div>
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
    </div>
  );
}
