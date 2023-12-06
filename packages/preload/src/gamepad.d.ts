import { ElectronAPI } from '@electron-toolkit/preload';
import { GamepadEvent } from '@main/gamepad/gamepadApi';

declare global {
  interface Window {
    electron: ElectronAPI;
    gamepadApi: {
      gamepadEvent: (event: GamepadEvent) => Promise<void>;
    };
    listeners: {
      onSystemResume: (callback: () => void) => void;
    };
  }
}
