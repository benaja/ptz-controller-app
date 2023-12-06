import {ipcMain} from 'electron';
import {userConfigStore} from '@main/store';

export type Gamepad = {
  id: string;
  connectionIndex: number;
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

function gamepadConnected({payload}: GamepadConnected): void {
  connectedGamepads.push(payload);

  const selectedGamepads = userConfigStore.get('selectedGamepads');
  if (selectedGamepads.primaryGamepad?.id === payload.id) {
    selectedGamepads.primaryGamepad.connectionIndex = payload.connectionIndex;
  } else if (selectedGamepads.secondaryGamepad?.id === payload.id) {
    selectedGamepads.secondaryGamepad.connectionIndex = payload.connectionIndex;
  }
  userConfigStore.set('selectedGamepads', selectedGamepads);
}

function gamepadDisconnected(gamepadEvent: GamepadDisconnected): void {
  const index = connectedGamepads.findIndex(gamepad => gamepad.id === gamepadEvent.payload.id);
  if (index !== -1) {
    connectedGamepads.splice(index, 1);
  }
}

function gamepadButtonEvent(gamepadEvent: ButtonEvent): void {
  // console.log('gamepadButtonEvent', gamepadEvent);
}

function gamepadAxisEvent(gamepadEvent: AxisEvent): void {
  // console.log('gamepadAxisEvent', gamepadEvent);
}

function updateGamepads(gamepadEvent: UpdateGamepads): void {
  connectedGamepads.splice(0, connectedGamepads.length, ...gamepadEvent.payload);

  const selectedGamepads = userConfigStore.get('selectedGamepads');
  if (selectedGamepads.primaryGamepad) {
    selectedGamepads.primaryGamepad.connectionIndex = connectedGamepads.findIndex(
      gamepad => gamepad.id === selectedGamepads.primaryGamepad?.id,
    );
  }
  if (selectedGamepads.secondaryGamepad) {
    const connectionIndex = connectedGamepads.findIndex(
      gamepad => gamepad.id === selectedGamepads.secondaryGamepad?.id,
    );
    if (connectionIndex !== selectedGamepads.primaryGamepad?.connectionIndex) {
      selectedGamepads.secondaryGamepad.connectionIndex = connectionIndex;
    }
  }

  console.log('updateGamepads', selectedGamepads);

  userConfigStore.set('selectedGamepads', selectedGamepads);
}

export function setSelectedGamepad({
  type,
  connectionIndex,
}: {
  type: 'primary' | 'secondary';
  connectionIndex: number | null;
}): void {
  console.log('setSelectedGamepad', type, connectionIndex);
  const gamepads = userConfigStore.get('selectedGamepads');

  let gamepad: Gamepad | null = null;
  if (connectionIndex !== null && connectionIndex !== -1) {
    gamepad =
      connectedGamepads.find(gamepad => gamepad.connectionIndex === connectionIndex) || null;
  }

  if (type === 'primary') {
    gamepads.primaryGamepad = gamepad;
  } else {
    gamepads.secondaryGamepad = gamepad;
  }
  userConfigStore.set('selectedGamepads', gamepads);
}

function resetConnectedGamepads(): void {
  connectedGamepads.splice(0, connectedGamepads.length);

  const selectedGamepads = userConfigStore.get('selectedGamepads');
  if (selectedGamepads.primaryGamepad) {
    selectedGamepads.primaryGamepad.connectionIndex = -1;
  }
  if (selectedGamepads.secondaryGamepad) {
    selectedGamepads.secondaryGamepad.connectionIndex = -1;
  }
}

export function registerGamepadApi(mainWindow: Electron.BrowserWindow) {
  resetConnectedGamepads();

  ipcMain.handle('gamepadEvent', (event, gamepadEvent: GamepadEvent): void => {
    mainWindow.webContents.send('onGamepadEvent', gamepadEvent);
    // console.log('gamepadEvent', gamepadEvent);
    switch (gamepadEvent.type) {
      case 'updateGamepads':
        return updateGamepads(gamepadEvent);
      case 'connected':
        return gamepadConnected(gamepadEvent);
      case 'disconnected':
        return gamepadDisconnected(gamepadEvent);
      case 'button':
        return gamepadButtonEvent(gamepadEvent);
      case 'axis':
        return gamepadAxisEvent(gamepadEvent);
    }
  });

  ipcMain.handle('getConnectedGamepads', (event): Gamepad[] => {
    const selectedGamepads = userConfigStore.get('selectedGamepads');

    return connectedGamepads.map(gamepad => ({
      id: gamepad.id,
      connectionIndex: gamepad.connectionIndex,
      isUse:
        selectedGamepads.primaryGamepad?.id === gamepad.id ||
        selectedGamepads.secondaryGamepad?.id === gamepad.id,
    }));
  });

  ipcMain.handle(
    'getSelectedGamepad',
    (event, {type}: {type: 'primary' | 'secondary'}): Gamepad | null => {
      const gamepads = userConfigStore.get('selectedGamepads');
      if (!gamepads) return null;
      if (type === 'primary') {
        return gamepads.primaryGamepad;
      } else {
        return gamepads.secondaryGamepad;
      }
    },
  );

  ipcMain.handle(
    'updateSelectedGamepad',
    (
      event,
      {type, connectionIndex}: {type: 'primary' | 'secondary'; connectionIndex: number | null},
    ) => {
      return setSelectedGamepad({type, connectionIndex});
    },
  );
}
