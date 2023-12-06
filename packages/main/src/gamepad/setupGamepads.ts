import { Gamepad, getPrimaryGamepad, getSecondaryGamepad } from '@/api/gamepadApi';
import { registerListener } from '@/events/eventBus';
import { GamepadController } from './GamepadController';

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
    primaryGamepad = getPrimaryGamepad();
    secondaryGamepad = getSecondaryGamepad();

    console.log('updateGamepads', primaryGamepad, secondaryGamepad);

    if (primaryGamepad) {
      if (!controllers.primary) {
        controllers.primary = new GamepadController(primaryGamepad);
      }
    } else {
      controllers.primary?.destroy();
      controllers.primary = null;
    }

    if (secondaryGamepad) {
      if (!controllers.secondary) {
        controllers.secondary = new GamepadController(secondaryGamepad);
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

  registerListener('gamepadConnected', updateGamepads);

  registerListener('gamepadDisconnected', updateGamepads);

  registerListener('gamepadButtonEvent', (buttonEvent) => {
    if (isPrimaryGamepad(buttonEvent.gamepad)) {
      controllers.primary?.onButton(buttonEvent);
    }
    if (isSecondaryGamepad(buttonEvent.gamepad)) {
      controllers.secondary?.onButton(buttonEvent);
    }
  });

  registerListener('gamepadAxisEvent', (axisEvent) => {
    if (isPrimaryGamepad(axisEvent.gamepad)) {
      controllers.primary?.onAxis(axisEvent);
    }
    if (isSecondaryGamepad(axisEvent.gamepad)) {
      controllers.secondary?.onAxis(axisEvent);
    }
  });
}
