import { vi } from 'vitest';
import { beforeEach } from 'vitest';
import { expect } from 'vitest';
import { test } from 'vitest';
import { registerEndpoints } from './setupApi';
import { ipcMain } from 'electron';

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
    ...electron,
  };
});

beforeEach(() => {
  vi.resetAllMocks();
});
test('It should register api Endpoints correctly', async () => {
  class TestApi {
    constructor() {}

    otherFunction() {}

    testEndpoint() {
      return 'test';
    }
  }
  const object = new TestApi();

  registerEndpoints(object);

  expect(ipcMain.handle).toHaveBeenCalledOnce();
  expect(ipcMain.handle).toHaveBeenCalledWith('test', expect.any(Function));
});
