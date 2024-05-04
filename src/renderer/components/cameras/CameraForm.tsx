import TextField from '../ui/TextField';
import Select from '../ui/Select';
import { CameraConnectionType } from '@core/CameraConnection/CameraConnectionTypes';
import { useEffect, useState } from 'react';
import { type MixerSource } from '@core/VideoMixer/IVideoMixer';

export type CameraFormType = {
  type: CameraConnectionType;
  ip: string;
  name: string;
  connectionPort?: string | null;
  sourceId: string | null;
  mixerId: string | null;
  isUpsideDown: boolean;
};

type Props = {
  form: CameraFormType;
  onChange: (form: CameraFormType) => void;
};

export default function CameraForm({ form, onChange }: Props) {
  const [sources, setSources] = useState<MixerSource[]>([]);
  const [mixers, setMixers] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);
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

  function fetchMixers() {
    window.videoMixerApi.getVideoMixers().then((mixers) => {
      setMixers(mixers);
    });
  }

  function fetchSources(mixerId: string) {
    window.videoMixerApi.getSources(mixerId).then((sources) => {
      setSources(sources);
    });
  }

  useEffect(() => {
    fetchMixers();
  }, []);

  useEffect(() => {
    if (form.mixerId) {
      fetchSources(form.mixerId);
    }
  }, [form.mixerId]);

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
        label="Name"
        value={form.name || ''}
        onChange={(value) => set('name', value)}
        required
      />
      <Select
        label="Mixer"
        items={mixers.map((mixer) => ({
          label: mixer.name,
          value: mixer.id,
        }))}
        value={form.mixerId}
        onChange={(value) => set('mixerId', value)}
        required
      />

      <Select
        label="Source"
        items={sources.map((source) => ({
          label: source.name,
          value: source.id,
        }))}
        value={form.sourceId}
        onChange={(value) => set('sourceId', value)}
        required
      />

      <div>
        <input
          name="isUpsideDown"
          id="isUpsideDown"
          type="checkbox"
          checked={form.isUpsideDown}
          onChange={(e) => set('isUpsideDown', e.target.value)}
        />
        <label
          className="ml-2"
          htmlFor="isUpsideDown"
        >
          Is upside down
        </label>
      </div>

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
