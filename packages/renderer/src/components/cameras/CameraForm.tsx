import { on } from 'events';
import TextField from '../ui/TextField';

export type CameraForm = {
  name: string;
  ip: string;
  port: number;
  number: number;
};

type Props = {
  form: CameraForm;
  onChange: (form: CameraForm) => void;
};

export default function CameraForm({ form, onChange }: Props) {
  function set(name: keyof CameraForm, value: string | number) {
    onChange({
      ...form,
      [name]: value,
    });
  }

  return (
    <>
      <TextField
        label="Name"
        value={form.name}
        onChange={(name) => set('name', name)}
        required
      />
      <TextField
        label="Ip"
        value={form.ip}
        onChange={(ip) => set('ip', ip)}
        required
      />
      <TextField
        label="Port"
        value={form.port.toString()}
        onChange={(value) => set('port', parseInt(value))}
        required
      />
      <TextField
        label="Nummer"
        value={form.number.toString()}
        onChange={(value) => set('number', parseInt(value))}
        required
        type="number"
      />
    </>
  );
}
