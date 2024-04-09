import { ButtonAction } from './BaseAction';

export class SetActiveCameraToPreviewAction extends ButtonAction {
  onPress() {
    console.log('SetActiveCameraToPreviewAction');
    this.params.setSelectCamera('preview');
  }
}

export class SetActiveCameraToOnAirAction extends ButtonAction {
  onPress() {
    console.log('SetActiveCameraToOnAirAction');
    this.params.setSelectCamera('onAir');
  }
}
