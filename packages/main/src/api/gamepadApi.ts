import { userConfigStore } from '@/store/userStore';
import Electron from 'electron';

export type Gamepad = {
  id: string;
  connectionIndex: number;
  type?: 'primary' | 'secondary';
  isUse?: boolean;
};

export type ButtonEventPayload = {
  button: number;
  pressed: boolean;
  value: number;
  gamepad: Gamepad;
};

export type AxisEventPayload = {
  axis: number;
  value: number;
  gamepad: Gamepad;
};

type GamepadConnected = {
  type: 'connected';
  payload: Gamepad;
};

type GamepadDisconnected = {
  type: 'disconnected';
  payload: Gamepad;
};

type ButtonEvent = {
  type: 'button';
  payload: ButtonEventPayload;
};

type AxisEvent = {
  type: 'axis';
  payload: AxisEventPayload;
};

type UpdateGamepads = {
  type: 'updateGamepads';
  payload: Gamepad[];
};

export type GamepadEvent =
  | GamepadConnected
  | GamepadDisconnected
  | ButtonEvent
  | AxisEvent
  | UpdateGamepads;

const connectedGamepads: Gamepad[] = [];

function getPrimaryGamepad() {
  const selectedGamepads = userConfigStore.get('selectedGamepads');
  if (!selectedGamepads.primaryGamepad) return null;

  const primaryGamepad = connectedGamepads.find(
    (gamepad) => gamepad.id === selectedGamepads.primaryGamepad,
  );
  if (!primaryGamepad) {
    return {
      id: selectedGamepads.primaryGamepad,
      connectionIndex: -1,
    };
  }

  return primaryGamepad;
}

function getSecondaryGamepad() {
  const selectedGamepads = userConfigStore.get('selectedGamepads');
  if (!selectedGamepads.secondaryGamepad) return null;

  const primaryGamepad = getPrimaryGamepad();
  const secondaryGamepad = connectedGamepads.find(
    (gamepad) =>
      gamepad.id === selectedGamepads.secondaryGamepad &&
      gamepad.connectionIndex !== primaryGamepad?.connectionIndex,
  );
  if (!secondaryGamepad) {
    return {
      id: selectedGamepads.secondaryGamepad,
      connectionIndex: -1,
    };
  }

  return secondaryGamepad;
}

function getConnectedGamepads(): Gamepad[] {
  const primaryGamepad = getPrimaryGamepad();
  const secondaryGamepad = getSecondaryGamepad();

  return connectedGamepads.map((gamepad) => {
    let type: 'primary' | 'secondary' | undefined = undefined;
    if (gamepad.connectionIndex === primaryGamepad?.connectionIndex) {
      type = 'primary';
    }
    if (gamepad.connectionIndex === secondaryGamepad?.connectionIndex) {
      type = 'secondary';
    }

    return { id: gamepad.id, connectionIndex: gamepad.connectionIndex, type, isUse: !!type };
  });
}

function resetConnectedGamepads(): void {
  connectedGamepads.splice(0, connectedGamepads.length);
}

export class GamepadApi {
  private window: Electron.BrowserWindow;

  public constructor(window: Electron.BrowserWindow) {
    resetConnectedGamepads();
    this.window = window;
  }

  public gamepadConnected({ payload }: GamepadConnected): void {
    if (connectedGamepads.find((gamepad) => gamepad.connectionIndex === payload.connectionIndex))
      return;
    connectedGamepads.push(payload);
  }

  public gamepadDisconnected(gamepadEvent: GamepadDisconnected): void {
    const index = connectedGamepads.findIndex(
      (gamepad) => gamepad.connectionIndex === gamepadEvent.payload.connectionIndex,
    );
    if (index !== -1) {
      connectedGamepads.splice(index, 1);
    }
  }

  public gamepadButtonEvent(gamepadEvent: ButtonEvent): void {
    // console.log('gamepadButtonEvent', gamepadEvent);
  }

  public gamepadAxisEvent(gamepadEvent: AxisEvent): void {
    // console.log('gamepadAxisEvent', gamepadEvent);
  }

  public updateGamepads(gamepadEvent: UpdateGamepads): void {
    connectedGamepads.splice(0, connectedGamepads.length, ...gamepadEvent.payload);
  }

  public updateSelectedGamepadEndpoint({
    type,
    connectionIndex,
  }: {
    type: 'primary' | 'secondary';
    connectionIndex: number | null;
  }): void {
    console.log('updateSelectedGamepad', type, connectionIndex);
    const selectedGamepads = userConfigStore.get('selectedGamepads');

    let newGampadId: string | null = null;
    if (connectionIndex !== null && connectionIndex !== -1) {
      newGampadId =
        connectedGamepads.find((gamepad) => gamepad.connectionIndex === connectionIndex)?.id ||
        null;
    }

    if (type === 'primary') {
      selectedGamepads.primaryGamepad = newGampadId;
    } else {
      selectedGamepads.secondaryGamepad = newGampadId;
    }
    userConfigStore.set('selectedGamepads', selectedGamepads);
  }

  public getSelectedGamepadEndpoint({ type }: { type: 'primary' | 'secondary' }): Gamepad | null {
    const gamepads = userConfigStore.get('selectedGamepads');
    if (!gamepads) return null;

    if (type === 'primary') {
      return getPrimaryGamepad();
    } else {
      return getSecondaryGamepad();
    }
  }

  public getConnectedGamepadsEndpoint(): Gamepad[] {
    return getConnectedGamepads();
  }

  public gamepadEventEndpoint(gamepadEvent: GamepadEvent) {
    this.window.webContents.send('onGamepadEvent', gamepadEvent);
    // console.log('gamepadEvent', gamepadEvent);
    switch (gamepadEvent.type) {
      case 'updateGamepads':
        return this.updateGamepads(gamepadEvent);
      case 'connected':
        return this.gamepadConnected(gamepadEvent);
      case 'disconnected':
        return this.gamepadDisconnected(gamepadEvent);
      case 'button':
        return this.gamepadButtonEvent(gamepadEvent);
      case 'axis':
        return this.gamepadAxisEvent(gamepadEvent);
    }
  }
}
