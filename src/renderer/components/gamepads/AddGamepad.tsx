import Layout from '@renderer/Layout';
import Container from '../ui/Container';
import GamepadForm, { GamepadFormType } from './GamepadForm';
import { useState } from 'react';
import { GamepadType } from '@core/api/GamepadType';
import AppButton from '../ui/AppButton';
import { useNavigate } from 'react-router-dom';

export default function AddGamepad() {
  const navigate = useNavigate();

  const [form, setForm] = useState<GamepadFormType>({
    name: '',
    type: GamepadType.WebApi,
    videoMixerId: null,
    connectionIndex: null,
  });

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log(form);

    window.gamepadConfigApi
      .addGamepad({
        ...form,
        keyBindings: {},
      })
      .then(() => {
        navigate('/gamepads');
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <Layout title="Add Gamepad">
      <form onSubmit={submit}>
        <Container>
          <div className="space-y-4 py-4">
            <GamepadForm
              form={form}
              onChange={(value) => setForm(value)}
            />
          </div>
        </Container>

        <div className="flex mt-6">
          <AppButton
            type="submit"
            className="ml-auto"
          >
            Save
          </AppButton>
        </div>
      </form>
    </Layout>
  );
}
