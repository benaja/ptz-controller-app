import {
  ActionParams,
  AxisAction,
  ButtonAction,
  IAxisAction,
  IButtonAction,
} from './actions/BaseAction';
import { PanCameraAction } from './actions/PanCameraAction';
import { TiltCameraAction } from './actions/TiltCameraAction';
import { ZoomCameraAction } from './actions/ZoomCameraAction';
import { ToggleAutofocusAction } from './actions/ToggleAutofocusAction';
import { ToggleTallyAction } from './actions/ToggleTallyAction';
import { CutInputAction } from './actions/CutInputAction';
import { NextInputAction } from './actions/NextInputAction';
import { PreviousInputAction } from './actions/PreviousInputAction';
import { CameraFactory } from '@core/CameraConnection/CameraFactory';
import { VideomixerFactory } from '@core/VideoMixer/VideoMixerFactory';
import { AxisEventPayload, ButtonEventPayload } from '@core/api/ConnectedGamepadApi';
import {
  SetActiveCameraToOnAirAction,
  SetActiveCameraToPreviewAction,
} from './actions/SetActiveCameraAction';
import {
  CameraPosition1Action,
  CameraPosition2Action,
  CameraPosition3Action,
  CameraPosition4Action,
} from './actions/CameraPositionAction';
import { GamepadConfig } from '@core/repositories/GamepadRepository';
import { INotificationApi } from '@core/api/INotificationApi';

export class GamepadController {
  private keyBindings: Record<string, number>;

  private axisActions: IAxisAction[];
  private buttonActions: IButtonAction[];

  public gamepadId: string;

  private activeCamera: 'preview' | 'onAir' = 'preview';

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

  private async getPreviewCamera() {
    const preview = await this.getVideoMixer().getPreview();
    if (!preview) {
      return null;
    }

    return this._cameraFactory.getCameraConnection(preview.id);
  }

  private async getOnAirCamera() {
    const onair = await this.getVideoMixer().getOnAir();
    if (!onair) {
      return null;
    }
    return this._cameraFactory.getCameraConnection(onair.id);
  }

  private async getSelectedCamera() {
    return this.activeCamera === 'preview' ? this.getPreviewCamera() : this.getOnAirCamera();
  }

  private registerAction<T>(action: new (params: ActionParams) => T) {
    return new action({
      getPreviewCamera: this.getPreviewCamera.bind(this),
      getOnAirCamera: this.getOnAirCamera.bind(this),
      getVideoMixer: this.getVideoMixer.bind(this),
      getSelectedCamera: this.getSelectedCamera.bind(this),
      notificationApi: this._notificationApi,
      setSelectCamera: (camera) => {
        this.activeCamera = camera;
        console.log('setSelectCamera', camera);
      },
      cameraFacotry: this._cameraFactory,
    });
  }

  constructor(
    private _config: GamepadConfig,
    private _cameraFactory: CameraFactory,
    private _videoMixerFactory: VideomixerFactory,
    private _notificationApi: INotificationApi,
    keyBindings: Record<string, number>,
  ) {
    this.keyBindings = keyBindings;

    this.gamepadId = _config.gamepadId;

    this.axisActions = [PanCameraAction, TiltCameraAction, ZoomCameraAction].map((action) =>
      this.registerAction<AxisAction>(action),
    );

    this.buttonActions = [
      ToggleAutofocusAction,
      ToggleTallyAction,
      CutInputAction,
      NextInputAction,
      PreviousInputAction,
      SetActiveCameraToOnAirAction,
      SetActiveCameraToPreviewAction,
      CameraPosition1Action,
      CameraPosition2Action,
      CameraPosition3Action,
      CameraPosition4Action,
    ].map((action) => this.registerAction<ButtonAction>(action));
  }

  onAxis(axis: AxisEventPayload) {
    this.axisActions.forEach((action) => {
      if (this.keyBindings[action.constructor.name] === axis.axis) {
        action.hanlde(axis.value);
      }
    });
  }

  onButton(button: ButtonEventPayload) {
    console.log('onButton', button.button, button.pressed ? 'pressed' : 'released');
    this.buttonActions.forEach((action) => {
      if (this.keyBindings[action.constructor.name] === button.button) {
        action.hanlde(button.pressed ? 'pressed' : 'released');
      }
    });
  }

  dispose() {}
}
