import { emit } from '@/events/eventBus';
import { userConfigStore } from '@/store/userStore';

export type Gamepad = {
  id: string;
  connectionIndex: number;
  type?: 'primary' | 'secondary';
  isUse?: boolean;
  keyBindings?: Record<string, number>;
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

export function getPrimaryGamepad() {
  const selectedGamepads = userConfigStore.get('selectedGamepads');
  if (!selectedGamepads.primaryGamepad.id) return null;

  const primaryGamepad = connectedGamepads.find(
    (gamepad) => gamepad.id === selectedGamepads.primaryGamepad.id,
  );
  if (!primaryGamepad) {
    return {
      id: selectedGamepads.primaryGamepad.id,
      connectionIndex: -1,
      keyBindings: selectedGamepads.primaryGamepad.keyBindings,
    };
  }
  primaryGamepad.keyBindings = selectedGamepads.primaryGamepad.keyBindings;

  return primaryGamepad;
}

export function getSecondaryGamepad(): Gamepad | null {
  const selectedGamepads = userConfigStore.get('selectedGamepads');
  if (!selectedGamepads.secondaryGamepad.id) return null;

  const primaryGamepad = getPrimaryGamepad();
  const secondaryGamepad = connectedGamepads.find(
    (gamepad) =>
      gamepad.id === selectedGamepads.secondaryGamepad.id &&
      gamepad.connectionIndex !== primaryGamepad?.connectionIndex,
  );
  if (!secondaryGamepad) {
    return {
      id: selectedGamepads.secondaryGamepad.id,
      connectionIndex: -1,
      keyBindings: selectedGamepads.secondaryGamepad.keyBindings,
    };
  }

  secondaryGamepad.keyBindings = selectedGamepads.secondaryGamepad.keyBindings;

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
  public constructor() {
    resetConnectedGamepads();
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
    emit('gamepadButtonEvent', gamepadEvent.payload);
    // console.log('gamepadButtonEvent', gamepadEvent);
  }

  public gamepadAxisEvent(gamepadEvent: AxisEvent): void {
    emit('gamepadAxisEvent', gamepadEvent.payload);
    // console.log('gamepadAxisEvent', gamepadEvent);
  }

  public updateGamepads(gamepadEvent: UpdateGamepads): void {
    const originalGamepads = [...connectedGamepads];

    connectedGamepads.splice(0, connectedGamepads.length, ...gamepadEvent.payload);

    const addedGamepads = connectedGamepads.filter(
      (gamepad) =>
        !originalGamepads.find(
          (originalGamepad) =>
            originalGamepad.id === gamepad.id &&
            originalGamepad.connectionIndex === gamepad.connectionIndex,
        ),
    );
    const removedGamepads = originalGamepads.filter(
      (gamepad) =>
        !connectedGamepads.find(
          (connectedGamepad) =>
            connectedGamepad.id === gamepad.id &&
            connectedGamepad.connectionIndex === gamepad.connectionIndex,
        ),
    );

    addedGamepads.forEach((gamepad) => {
      emit('gamepadConnected', gamepad);
    });
    removedGamepads.forEach((gamepad) => {
      emit('gamepadDisconnected', gamepad);
    });
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
      selectedGamepads.primaryGamepad.id = newGampadId;
    } else {
      selectedGamepads.secondaryGamepad.id = newGampadId;
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
    emit('gamepadEvent', gamepadEvent);
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
