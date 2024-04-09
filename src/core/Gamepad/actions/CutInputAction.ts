import { ButtonAction } from './BaseAction';

export class CutInputAction extends ButtonAction {
  async onPress() {
    const mixer = await this.getVideoMixer();

    if (!mixer) return;

    mixer.cut();
  }
}
