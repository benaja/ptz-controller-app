import { IAxisAction, IButtonAction } from './actions/BaseAction';
import { PanCameraAction } from './actions/PanCameraAction';
import { TiltCameraAction } from './actions/TiltCameraAction';
import { ZoomCameraAction } from './actions/ZoomCameraAction';
import { ToggleAutofocusAction } from './actions/ToggleAutofocusAction';
import { ToggleTallyAction } from './actions/ToggleTallyAction';
import { CutInputAction } from './actions/CutInputAction';
import { NextInputAction } from './actions/NextInputAction';
import { PreviousInputAction } from './actions/PreviousInputAction';
import { GamepadConfig } from '@core/store/userStore';
import { CameraConnectionFactory } from '@core/CameraConnection/CameraConnectionFactory';
import { VideomixerFactory } from '@core/VideoMixer/VideoMixerFactory';
import { AxisEventPayload, ButtonEventPayload } from '@core/api/ConnectedGamepadApi';
import { GetCurrentPositionAction } from './actions/GetCurrentPositionAction';

export class GamepadController {
  public selectedCamera = 1;
  private keyBindings: Record<string, number>;

  private axisActions: IAxisAction[];
  private buttonActions: IButtonAction[];

  public connectionIndex: number;

  private getVideoMixer() {
    if (!this._config.videoMixerId) {
      throw new Error('mixer not connected');
    }
    const videoMixer = this._videoMixerFactory.get(this._config.videoMixerId);
    if (!videoMixer) {
      throw new Error('Videomixer nocht connected');
    }
    return videoMixer;
  }

  private getPreviewCamera() {
    return this._cameraFactory.getCameraConnection(this.getVideoMixer().getPreview());
  }

  private getOnAirCamera() {
    return this._cameraFactory.getCameraConnection(this.getVideoMixer().getOnAir());
  }

  constructor(
    private _config: GamepadConfig,
    private _cameraFactory: CameraConnectionFactory,
    private _videoMixerFactory: VideomixerFactory,
    keyBindings: Record<string, number>,
  ) {
    this.keyBindings = keyBindings;

    this.connectionIndex = _config.connectionIndex;
    this.isConnected = _config.connectionIndex !== undefined;

    this.axisActions = [
      new PanCameraAction(this.getPreviewCamera.bind(this)),
      new TiltCameraAction(this.getPreviewCamera.bind(this)),
      new ZoomCameraAction(this.getPreviewCamera.bind(this)),
      // new FocusCameraAction(this.currentState),
    ];

    this.buttonActions = [
      new ToggleAutofocusAction(this.getPreviewCamera.bind(this)),
      new ToggleTallyAction(this.getPreviewCamera.bind(this)),
      new CutInputAction(this.getVideoMixer.bind(this)),
      new NextInputAction(this.getVideoMixer.bind(this)),
      new PreviousInputAction(this.getVideoMixer.bind(this)),
      new GetCurrentPositionAction(this.getPreviewCamera.bind(this)),
    ];
  }

  onAxis(axis: AxisEventPayload) {
    this.axisActions.forEach((action) => {
      if (this.keyBindings[action.constructor.name] === axis.axis) {
        action.hanlde(axis.value);
      }
    });
  }

  onButton(button: ButtonEventPayload) {
    console.log('onButton', button.button);
    this.buttonActions.forEach((action) => {
      if (this.keyBindings[action.constructor.name] === button.button) {
        action.hanlde(button.pressed ? 'pressed' : 'released');
      }
    });
  }

  dispose() {}
}
