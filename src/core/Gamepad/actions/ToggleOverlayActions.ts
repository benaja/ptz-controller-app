import { ButtonAction } from './BaseAction';

export class ToggleOverlay1 extends ButtonAction {
  async onPress() {
    const mixer = await this.getVideoMixer();
    mixer?.toggleOverlay(1);

    console.log('ToggleOverlay1');
  }
}

export class ToggleOverlay2 extends ButtonAction {
  async onPress() {
    const mixer = await this.getVideoMixer();
    mixer?.toggleOverlay(2);

    console.log('ToggleOverlay2');
  }
}

export class ToggleOverlay3 extends ButtonAction {
  async onPress() {
    const mixer = await this.getVideoMixer();
    mixer?.toggleOverlay(3);

    console.log('ToggleOverlay3');
  }
}

export class ToggleOverlay4 extends ButtonAction {
  async onPress() {
    const mixer = await this.getVideoMixer();
    mixer?.toggleOverlay(4);

    console.log('ToggleOverlay4');
  }
}
