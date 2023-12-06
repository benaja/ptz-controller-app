import type { MockedClass, MockedObject } from 'vitest';
import { beforeEach, expect, test, vi } from 'vitest';

import { BrowserWindow, ipcMain } from 'electron';
import '../src/index';

/**
 * Mock real electron BrowserWindow API
 */
// vi.mock('electron', () => {
//   // Use "as unknown as" because vi.fn() does not have static methods
//   const bw = vi.fn() as unknown as MockedClass<typeof BrowserWindow>;
//   bw.getAllWindows = vi.fn(() => bw.mock.instances);
//   bw.prototype.loadURL = vi.fn((_: string, __?: Electron.LoadURLOptions) => Promise.resolve());
//   bw.prototype.loadFile = vi.fn((_: string, __?: Electron.LoadFileOptions) => Promise.resolve());
//   // Use "any" because the on function is overloaded
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   bw.prototype.on = vi.fn<any>();
//   bw.prototype.destroy = vi.fn();
//   bw.prototype.isDestroyed = vi.fn();
//   bw.prototype.isMinimized = vi.fn();
//   bw.prototype.focus = vi.fn();
//   bw.prototype.restore = vi.fn();

//   const app: Pick<Electron.App, 'getAppPath'> = {
//     getAppPath(): string {
//       return '';
//     },
//   };

//   return { BrowserWindow: bw, app };
// });

// beforeEach(() => {
//   vi.clearAllMocks();
// });

// test('Should create a new window', async () => {
//   ipcMain.handle('get-user-config', () => ({}));
// });
