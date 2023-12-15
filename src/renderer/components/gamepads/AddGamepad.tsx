import Layout from '@renderer/Layout';
import Container from '../ui/Container';

export default function AddGamepad() {
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <Layout title="Add Gamepad">
      <Container>
        <form onSubmit={submit}>
          <div className="divide-y">
            <p className="text-gray-400 text-center py-2">No gamepads</p>
          </div>
        </form>
      </Container>
    </Layout>
  );
}
