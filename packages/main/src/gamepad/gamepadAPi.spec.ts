import type { ElectronApplication, JSHandle } from 'playwright';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { _electron as electron } from 'playwright';

let electronApp: ElectronApplication;

beforeAll(async () => {
  electronApp = await electron.launch({ args: ['src/main/index.ts'] });
});

afterAll(async () => {
  // await electronApp.close();
});

test('Main window state', async () => {
  const mainWindow = await electronApp.firstWindow();
  expect(true).toBe(true);
});
