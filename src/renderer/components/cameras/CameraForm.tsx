import { on } from 'events';
import TextField from '../ui/TextField';

export type CameraForm = {
  ip: string;
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
        label="Ip"
        value={form.ip}
        onChange={(ip) => set('ip', ip)}
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
