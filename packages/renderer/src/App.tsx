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

const router = createMemoryRouter(
  [
    {
      path: '/gamepads',
      element: <ManageGamepads />,
    },
    {
      path: '/gamepads/:type',
      element: <EditGampadType />,
    },
    {
      path: '/cams',
      element: <TestPage />,
    },
  ],
  {
    initialEntries: ['/gamepads'],
  }
);

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
          <Route element={<ManageGamepads />} path="/gamepads" />
          <Route element={<EditGampadType />} path="/gamepads/:type" />
          <Route element={<TestPage />} path="/cams" />
        </Routes>
      </HistoryProvider>
    </MemoryRouter>
  );
}

export default App;
