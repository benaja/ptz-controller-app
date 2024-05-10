import { ButtonAction } from './BaseAction';

export class PreviousInputAction extends ButtonAction {
  async onPress() {
    const mixer = await this.getVideoMixer();
    mixer?.previousInput();

    console.log('PreviousInputAction');
  }
}
