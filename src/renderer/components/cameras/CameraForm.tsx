import TextField from '../ui/TextField';
import Select from '../ui/Select';
import { CameraConnectionType } from '@core/CameraConnection/CameraConnectionTypes';
import { useEffect, useState } from 'react';
import { type MixerSource } from '@core/VideoMixer/IVideoMixer';

export type CameraFormType = {
  type: CameraConnectionType;
  ip: string;
  number: number;
  connectionPort?: string;
  source: string | null;
};

type Props = {
  form: CameraFormType;
  onChange: (form: CameraFormType) => void;
};

export default function CameraForm({ form, onChange }: Props) {
  const [sources, setSources] = useState<MixerSource[]>([]);
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

  function set(name: keyof CameraFormType, value: string | number | null) {
    onChange({
      ...form,
      [name]: value,
    });
  }

  function fetchSources() {
    window.videoMixerApi.getScources().then((sources) => {
      setSources(sources);
    });
  }

  useEffect(() => {
    fetchSources();
  }, []);

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
      <Select
        label="Quelle"
        items={sources.map((source) => ({
          label: source.name,
          value: source.id,
        }))}
        value={form.source}
        onChange={(value) => set('source', value)}
        required
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
