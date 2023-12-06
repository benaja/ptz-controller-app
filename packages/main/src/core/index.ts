import { setupApi } from '@/api/setupApi';
import { setupGamepads } from '@/gamepad/setupGamepads';

export function setupCore() {
  setupApi();
  setupGamepads();
}
