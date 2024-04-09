import Layout from '@renderer/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '../ui/Container';
import { useEffect, useState } from 'react';
import GamepadForm, { type GamepadFormType } from './GamepadForm';
import AppButton from '../ui/AppButton';
import { GamepadResponse } from '@core/api/GamepadConfigApi';

export default function EditGampad() {
  const { id } = useParams<{ id: string }>();
  const [gamepad, setGamepad] = useState<GamepadResponse | null>(null);
  const [form, setForm] = useState<GamepadFormType | null>();
  const navigate = useNavigate();

  function loadSelectedGamepad() {
    if (!id) return;
    window.gamepadConfigApi.getGamepad(id).then((value) => {
      console.log('camepad', value);
      setGamepad(value);
      setForm({
        ...value,
      });
    });
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form || !id || form.connectionIndex === null) return;

    window.gamepadConfigApi
      .updateGamepad({
        id,
        keyBindings: {},
        ...form,
        connectionIndex: form.connectionIndex,
      })
      .then(() => {
        navigate('/gamepads');
      });
  }

  function deleteGamepad() {
    if (!id) return;

    window.gamepadConfigApi.removeGamepad(id).then(() => {
      navigate('/gamepads');
    });
  }

  useEffect(() => {
    loadSelectedGamepad();
  }, []);

  return (
    <Layout title={`Edit Gamepad`}>
      {form && (
        <form onSubmit={submit}>
          <Container className="py-4">
            <GamepadForm
              form={form}
              original={gamepad}
              onChange={(value) => setForm(value)}
            />
            {/* <h2 className="text-xl">{type?.charAt(0).toUpperCase() + type?.slice(1)} Gamepad</h2> */}
          </Container>

          <div className="mt-6 flex">
            <AppButton
              className="border-red-300 text-red-600"
              onClick={deleteGamepad}
            >
              Delete
            </AppButton>
            <AppButton
              type="submit"
              className="ml-auto"
            >
              Speichern
            </AppButton>
          </div>
        </form>
      )}
    </Layout>
  );
}
