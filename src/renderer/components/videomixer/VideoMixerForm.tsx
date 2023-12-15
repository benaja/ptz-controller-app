import { VideoMixerType } from '@core/VideoMixer/VideoMixerType';
import Select from '../ui/Select';
import TextField from '../ui/TextField';

export type VideoMixerFormType = {
  type: VideoMixerType;
  name: string;
  ip: string;
  password?: string | null;
  mixEffectBlock?: number | null;
};

type Props = {
  form: VideoMixerFormType;
  onChange: (form: VideoMixerFormType) => void;
};

export default function VideoMixerForm({ form, onChange }: Props) {
  const videoMixerTypes = [
    {
      label: 'Blackmagic Atem',
      value: VideoMixerType.BlackmagicAtem,
    },
    {
      label: 'Obs',
      value: VideoMixerType.OBS,
    },
    {
      label: 'Vmix',
      value: VideoMixerType.Vmix,
    },
  ];

  function set(name: keyof VideoMixerFormType, value: string | number | null) {
    onChange({
      ...form,
      [name]: value,
    });
  }

  return (
    <>
      <Select
        items={videoMixerTypes}
        label="Mixer"
        value={form.type}
        onChange={(type) => set('type', type)}
      />

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
        label="Password"
        value={form.password || ''}
        onChange={(password) => set('password', password)}
      />

      {form.type === VideoMixerType.BlackmagicAtem && (
        <TextField
          label="MixEffectBlock"
          value={form.mixEffectBlock?.toString() || ''}
          onChange={(value) => set('mixEffectBlock', value ? parseInt(value) : null)}
          type="number"
          required
        />
      )}
    </>
  );
}
