import {
  AxisEventPayload,
  ButtonEventPayload,
  Gamepad,
  getPrimaryGamepad,
  getSecondaryGamepad,
} from '@core/api/gamepadConfigApi';
import { registerListener } from '@core/events/eventBus';
import { GamepadController } from './GamepadController';
import { userConfigStore } from '@core/store/userStore';

export function setupGamepads() {
  const controllers: {
    primary: GamepadController | null;
    secondary: GamepadController | null;
  } = {
    primary: null,
    secondary: null,
  };
  let primaryGamepad: Gamepad | null = null;
  let secondaryGamepad: Gamepad | null = null;

  function updateGamepads() {
    const userStore = userConfigStore.get('selectedGamepads');
    primaryGamepad = getPrimaryGamepad();
    secondaryGamepad = getSecondaryGamepad();

    if (primaryGamepad) {
      if (!controllers.primary) {
        controllers.primary = new GamepadController(primaryGamepad, primaryGamepad.keyBindings);
      }
    } else {
      controllers.primary?.destroy();
      controllers.primary = null;
    }

    if (secondaryGamepad) {
      if (!controllers.secondary) {
        controllers.secondary = new GamepadController(
          secondaryGamepad,
          secondaryGamepad.keyBindings,
        );
      }
    } else {
      controllers.secondary?.destroy();
      controllers.secondary = null;
    }
  }

  function isPrimaryGamepad(gamepad: Gamepad) {
    return controllers.primary && primaryGamepad?.connectionIndex === gamepad.connectionIndex;
  }

  function isSecondaryGamepad(gamepad: Gamepad) {
    return controllers.secondary && secondaryGamepad?.connectionIndex === gamepad.connectionIndex;
  }

  function buttonEvent(buttonEvent: ButtonEventPayload) {
    if (isPrimaryGamepad(buttonEvent.gamepad)) {
      controllers.primary?.onButton(buttonEvent);
    }
    if (isSecondaryGamepad(buttonEvent.gamepad)) {
      controllers.secondary?.onButton(buttonEvent);
    }
  }

  function axisEvent(axisEvent: AxisEventPayload) {
    if (isPrimaryGamepad(axisEvent.gamepad)) {
      controllers.primary?.onAxis(axisEvent);
    }
    if (isSecondaryGamepad(axisEvent.gamepad)) {
      controllers.secondary?.onAxis(axisEvent);
    }
  }

  const listeners = [
    registerListener('gamepadConnected', updateGamepads),
    registerListener('gamepadDisconnected', updateGamepads),
    registerListener('gamepadButtonEvent', buttonEvent),
    registerListener('gamepadAxisEvent', axisEvent),
  ];

  return () => {
    listeners.forEach((listener) => listener());
    controllers.primary?.destroy();
    controllers.secondary?.destroy();
  };
}
