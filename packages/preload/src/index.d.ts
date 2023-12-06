import { ElectronAPI } from '@electron-toolkit/preload';
import { UserConfig } from '../main/userConfig';
import { Gamepad, GamepadEvent } from '@main/gamepad/gamepadApi';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      onGamepadEvent: (callback: (event: any, gamepad: GamepadEvent) => void) => () => void;
      getConnectedGamepads: () => Promise<Gamepad[]>;
      getUserConfig: (key: keyof UserConfig) => Promise<UserConfig[keyof UserConfig]>;
      setUserConfig: (key: keyof UserConfig, value: UserConfig[keyof UserConfig]) => Promise<void>;
      getSelectedGamepad: (args: { type: 'primary' | 'secondary' }) => Promise<Gamepad | null>;
      setSelectedGamepad: (args: {
        type: 'primary' | 'secondary';
        connectionIndex: number | null;
      }) => Promise<void>;
    };
  }
}
