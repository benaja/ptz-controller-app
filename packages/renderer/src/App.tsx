import { useEffect, useState } from 'react';
import ManageGamepads from './components/gamepads/ManageGamepads';
import {
  BrowserRouter,
  RouterProvider,
  Routes,
  createMemoryRouter,
  Route,
  MemoryRouter,
} from 'react-router-dom';
import TestPage from './components/TestPage';
import EditGampadType from './components/gamepads/EditGampadType';
import { HistoryProvider } from './providers/HistoryProvider';
import Cameras from './components/cameras/Cameras';
import AddCamera from './components/cameras/AddCamera';
import EditCamera from './components/cameras/EditCamera';
import VideoMixerConfiguration from './components/videomixer/VideoMixerConfiguration';

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
            element={<EditGampadType />}
            path="/gamepads/:type"
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
            element={<VideoMixerConfiguration />}
            path="/video-mixer"
          />
        </Routes>
      </HistoryProvider>
    </MemoryRouter>
  );
}

export default App;
