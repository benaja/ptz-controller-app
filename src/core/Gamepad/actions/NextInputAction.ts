import { ButtonAction } from './BaseAction';

export class NextInputAction extends ButtonAction {
  onPress(): void {
    console.log('NextInputAction');
    // this.getVideoMixer()?.nextInput();
  }

  onRelease() {
    console.log('asdfa');
  }
}
