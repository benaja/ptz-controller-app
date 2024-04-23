import { VideoMixerType } from '@core/VideoMixer/VideoMixerType';
import Select from '../ui/Select';
import TextField from '../ui/TextField';
import { VideoMixerConfig } from '@core/repositories/VideoMixerRepository';

export type VideoMixerFormType = VideoMixerConfig;

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
    {
      label: 'Pass Through',
      value: VideoMixerType.Passthrough,
    },
  ];

  function set(name: string, value: string | number | null) {
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

      {form.type !== VideoMixerType.Passthrough && (
        <TextField
          label="Ip"
          value={form.ip}
          onChange={(ip) => set('ip', ip)}
          required
        />
      )}

      {form.type === VideoMixerType.OBS && (
        <TextField
          label="Password"
          value={form.password || ''}
          onChange={(password) => set('password', password)}
        />
      )}

      {/* {form.type === VideoMixerType.BlackmagicAtem && (
        <TextField
          label="MixEffectBlock"
          value={form.mixEffectBlock?.toString() || ''}
          onChange={(value) => set('mixEffectBlock', value ? parseInt(value) : null)}
          type="number"
          required
        />
      )} */}
    </>
  );
}
