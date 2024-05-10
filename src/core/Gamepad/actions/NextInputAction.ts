import { ButtonAction } from './BaseAction';

export class NextInputAction extends ButtonAction {
  async onPress() {
    const mixer = await this.getVideoMixer();
    mixer?.nextInput();
    console.log('NextInputAction');
  }
}
