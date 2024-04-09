import { ButtonAction } from './BaseAction';

export class SetAutoFocusAction extends ButtonAction {
  private lastState = false;

  async onPress() {
    this.lastState = !this.lastState;

    const camera = await this.getSelectedCamera();

    camera?.setAutoFocus(this.lastState);
  }
}
