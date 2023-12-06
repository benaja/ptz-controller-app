import { vi } from 'vitest';

export function electronMock() {
  const electron = {
    ipcRenderer: {
      invoke: vi.fn(),
    },
    ipcMain: {
      handle: vi.fn(),
    },
    app: {
      getPath: vi.fn((str) => str),
    },
  };

  return {
    default: electron,
    ...electron,
  };
}
