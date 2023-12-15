import TextField from '../ui/TextField';
import Select from '../ui/Select';
import { CameraConnectionType } from '@core/CameraConnection/CameraConnectionTypes';

export type CameraFormType = {
  type: CameraConnectionType;
  ip: string | null;
  number: number;
  connectionPort?: string;
};

type Props = {
  form: CameraFormType;
  onChange: (form: CameraFormType) => void;
};

export default function CameraForm({ form, onChange }: Props) {
  const cameraTypes = [
    {
      label: 'Arduino PTZ Camera',
      value: CameraConnectionType.ArduinoPtzCamera,
    },
    {
      label: 'CGF PTZ Camera',
      value: CameraConnectionType.CgfPtzCamera,
    },
  ];

  function set(name: keyof CameraFormType, value: string | number) {
    onChange({
      ...form,
      [name]: value,
    });
  }

  return (
    <>
      <Select
        label="Camera type"
        items={cameraTypes}
        value={form.type}
        onChange={(type) => set('type', type)}
      />
      <TextField
        label="Ip"
        value={form.ip || ''}
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
      {form.type === CameraConnectionType.CgfPtzCamera && (
        <TextField
          label="Connection Port"
          value={form.connectionPort || ''}
          onChange={(value) => set('connectionPort', value)}
          required
        />
      )}
    </>
  );
}
