import ManageGamepads from './components/gamepads/ManageGamepads';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import EditGampad from './components/gamepads/EditGamepad';
import { HistoryProvider } from './providers/HistoryProvider';
import Cameras from './components/cameras/Cameras';
import AddCamera from './components/cameras/AddCamera';
import EditCamera from './components/cameras/EditCamera';
import './assets/index.css';
import VideoMixers from './components/videomixer/VideMixers';
import AddVideoMixer from './components/videomixer/AddVideoMixer';
import EditVideoMixer from './components/videomixer/EditVideoMixer';
import AddGamepad from './components/gamepads/AddGamepad';

function App(): JSX.Element {
  // useEffect(() => {
  //   const removeCameraConnectedListener = window.api.newCammeraConnected((event, message) => {
  //     console.log('newCammeraConnected', message);
  //   });

  //   return () => {
  //     removeCameraConnectedListener();
  //   };
  // }, []);

  // console.log('store', store.get('windowBounds'));

  return (
    <MemoryRouter initialEntries={['/gamepads']}>
      <HistoryProvider>
        <Routes>
          <Route
            element={<ManageGamepads />}
            path="/gamepads"
          />
          <Route
            element={<AddGamepad />}
            path="/gamepads/add"
          />
          <Route
            element={<EditGampad />}
            path="/gamepads/:id"
          />
          <Route
            element={<Cameras />}
            path="/cameras"
          />
          <Route
            element={<AddCamera />}
            path="/cameras/add"
          />
          <Route
            element={<EditCamera />}
            path="/cameras/:id"
          />
          <Route
            element={<VideoMixers />}
            path="/video-mixers"
          />
          <Route
            element={<AddVideoMixer />}
            path="/video-mixers/add"
          />
          <Route
            element={<EditVideoMixer />}
            path="/video-mixers/:id"
          />
        </Routes>
      </HistoryProvider>
    </MemoryRouter>
  );
}

export default App;
