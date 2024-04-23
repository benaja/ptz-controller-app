import Layout from '@renderer/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '../ui/Container';
import { useEffect, useState } from 'react';
import GamepadForm, { type GamepadFormType } from './GamepadForm';
import AppButton from '../ui/AppButton';
import { GamepadResponse } from '@core/api/GamepadConfigApi';
import { parseErrorMessage } from '@renderer/lib/utils';
import { GamepadConfig } from '@core/repositories/GamepadRepository';

export default function EditGampad() {
  const { id } = useParams<{ id: string }>();
  const [gamepad, setGamepad] = useState<GamepadResponse | null>(null);
  const [form, setForm] = useState<GamepadFormType | null>();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function loadSelectedGamepad() {
    if (!id) return;
    window.gamepadConfigApi.getGamepad(id).then((value) => {
      if (!value) {
        throw new Error('Gamepad not found');
      }

      console.log('camepad', value);
      setGamepad(value);
      setForm({
        ...value,
      });
    });
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form || !id) return;

    window.gamepadConfigApi
      .updateGamepad({
        id,
        keyBindings: {},
        ...form,
      } as GamepadConfig)
      .then(() => {
        navigate('/gamepads');
      })
      .catch((e) => {
        console.log(e);
        setErrorMessage(parseErrorMessage(e));
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

            {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
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
