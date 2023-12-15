import { test } from 'vitest';
import { GamepadApi } from './gamepadConfigApi';
import { vi } from 'vitest';
import { expect } from 'vitest';
import { beforeEach } from 'vitest';
import { BrowserWindow } from 'electron';

let gamepadApi: GamepadApi;

vi.mock('electron', () => {
  const electron = {
    ipcMain: {
      handle: vi.fn(),
    },
    app: {
      getPath: vi.fn((str) => str),
    },
  };

  return {
    default: electron,
    BrowserWindow: vi.fn(() => ({
      webContents: {
        send: vi.fn(),
      },
    })),
  };
});
vi.mock('fs', () => ({
  default: {
    readFileSync: vi.fn(() => 'test'),
    writeFileSync: vi.fn(),
  },
}));

beforeEach(() => {
  const browserWindow = new BrowserWindow();
  gamepadApi = new GamepadApi(browserWindow);
});

test('update gamepads', () => {
  gamepadApi.gamepadEventEndpoint({
    type: 'updateGamepads',
    payload: [
      {
        id: 'test',
        connectionIndex: 0,
      },
      {
        id: 'test1',
        connectionIndex: 1,
      },
    ],
  });

  const connectedGamepads = gamepadApi.getConnectedGamepadsEndpoint();
  expect(connectedGamepads).toHaveLength(2);
});

test('update selected gamepad', () => {
  gamepadApi.gamepadEventEndpoint({
    type: 'updateGamepads',
    payload: [
      {
        id: 'test',
        connectionIndex: 0,
      },
      {
        id: 'test',
        connectionIndex: 1,
      },
    ],
  });

  gamepadApi.updateSelectedGamepadEndpoint({
    type: 'primary',
    connectionIndex: 0,
  });

  const primaryGamepad = gamepadApi.getSelectedGamepadEndpoint({ type: 'primary' });
  expect(primaryGamepad).toEqual({
    id: 'test',
    connectionIndex: 0,
  });

  const connectedGamepads = gamepadApi.getConnectedGamepadsEndpoint();
  expect(connectedGamepads).toMatchSnapshot();
});

test('can handle two gamepads with same id', () => {
  gamepadApi.gamepadEventEndpoint({
    type: 'updateGamepads',
    payload: [
      {
        id: 'test',
        connectionIndex: 0,
      },
      {
        id: 'test',
        connectionIndex: 1,
      },
    ],
  });

  gamepadApi.updateSelectedGamepadEndpoint({
    type: 'primary',
    connectionIndex: 0,
  });

  gamepadApi.updateSelectedGamepadEndpoint({
    type: 'secondary',
    connectionIndex: 1,
  });

  const connectedGamepads = gamepadApi.getConnectedGamepadsEndpoint();
  expect(connectedGamepads).toMatchSnapshot();
});
