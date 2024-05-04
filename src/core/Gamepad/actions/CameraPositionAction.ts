import { ActionParams, ButtonAction } from './BaseAction';

class CameraPositionAction extends ButtonAction {
  constructor(public positionNumber: number, params: ActionParams) {
    super(params);
  }

  async onRelease() {
    const camera = await this.getSelectedCamera();
    if (!camera) return;

    const cameraConfig = await this.params.cameraFacotry.cameraRepository
      .getAll()
      .find((c) => c.id === camera.id);
    if (!cameraConfig) return;

    const positions = cameraConfig.positions;
    const position = positions?.[this.positionNumber];
    if (!position) return;

    camera.goToPosition({
      ...position,
      speed: 100,
    });
  }

  async onLongPress() {
    const camera = await this.getSelectedCamera();
    if (!camera) return;

    const cameraConfig = await this.params.cameraFacotry.cameraRepository.getAll();

    const currentCameraConfig = cameraConfig.find((c) => c.id === camera.id);
    if (!currentCameraConfig) return;

    if (!currentCameraConfig.positions) {
      currentCameraConfig.positions = {};
    }
    currentCameraConfig.positions[this.positionNumber] = await camera.getCurrentPosition();
    await this.params.cameraFacotry.cameraRepository.update(
      currentCameraConfig.id,
      currentCameraConfig,
    );

    this.params.notificationApi.notify({
      title: `Position ${this.positionNumber} saved`,
      body: `Position: ${JSON.stringify(currentCameraConfig.positions[this.positionNumber])}`,
    });
  }
}

export class CameraPosition1Action extends CameraPositionAction {
  constructor(params: ActionParams) {
    super(1, params);
  }
}

export class CameraPosition2Action extends CameraPositionAction {
  constructor(params: ActionParams) {
    super(2, params);
  }
}

export class CameraPosition3Action extends CameraPositionAction {
  constructor(params: ActionParams) {
    super(3, params);
  }
}

export class CameraPosition4Action extends CameraPositionAction {
  constructor(params: ActionParams) {
    super(4, params);
  }
}
