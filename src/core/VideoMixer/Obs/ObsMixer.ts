import log from 'electron-log/main';
import OBSWebSocket from 'obs-websocket-js';
import { throttle } from '@main/utils/throttle';
import { IVideoMixer, baseVideoMixerSchema } from '../IVideoMixer';
import { z } from 'zod';
import { VideoMixerType } from '../VideoMixerType';
import { ITallyHub } from '@core/Tally/ITallyHub';
import { TallyHub } from '@core/Tally/TallyHub';
import { CameraFactory } from '@core/CameraConnection/CameraFactory';

type Scene = {
  sceneName: string;
  sceneIndex: number;
};

export const obsMixerConfigSchema = baseVideoMixerSchema.extend({
  type: z.literal(VideoMixerType.OBS),
  password: z.string().nullable(),
  ip: z.string(),
});

export type ObsMixerConfig = z.infer<typeof obsMixerConfigSchema>;

export class ObsMixer implements IVideoMixer {
  public readonly name = VideoMixerType.OBS;
  public readonly label = 'OBS';
  public static readonly type = VideoMixerType.OBS;

  private _currentOnAir: Scene | null = null;
  private _currentPreview: Scene | null = null;
  private _obs: OBSWebSocket;
  private _isConnected = false;

  private _tallyHub: ITallyHub;

  public get isConnected(): boolean {
    return this._isConnected;
  }

  public set isConnected(value: boolean) {
    this._isConnected = value;
  }

  constructor(private _config: ObsMixerConfig, private _cameraFactory: CameraFactory) {
    this._obs = new OBSWebSocket();
    this.connect(_config);

    this._tallyHub = new TallyHub(_cameraFactory, this);
  }

  public connect(config: ObsMixerConfig) {
    log.info('connecting to OBS', config.ip, config.password);
    this._obs
      .connect(`ws://${config.ip}`, config.password || undefined)
      .then(async () => {
        this.isConnected = true;
        const preview = await this._obs.call('GetCurrentPreviewScene');
        this._currentPreview = await this.getSceneByName(preview.currentPreviewSceneName);

        const onAir = await this._obs.call('GetCurrentProgramScene');
        this._currentOnAir = await this.getSceneByName(onAir.currentProgramSceneName);
        console.log(`Successfully connected to OBS!`);

        this._tallyHub.updateTally();

        this._obs.on('CurrentPreviewSceneChanged', async (data) => {
          this._currentPreview = await this.getSceneByName(data.sceneName);
          this._tallyHub.updateTally();
        });
        this._obs.on('CurrentProgramSceneChanged', async (data) => {
          this._currentOnAir = await this.getSceneByName(data.sceneName);
          this._tallyHub.updateTally();
        });
        this._obs.on('ConnectionClosed', () => {
          this._obs.removeAllListeners();
          this._obs.disconnect();
          console.log('Connection closed');
          this.isConnected = false;
          setTimeout(() => {
            this.connect(config);
          }, 1000);
        });
      })
      .catch(() => {
        // console.log('Failed to connect to OBS');
        setTimeout(() => {
          this.connect(config);
        }, 1000);
      });
  }

  public dispose() {
    this._obs.disconnect();
  }

  public async getPreview() {
    console.log('getPreview', this._currentPreview);
    if (!this._currentPreview) return null;

    return this.getPrimarySourceBySceneName(this._currentPreview?.sceneName);
  }

  public async getOnAir() {
    if (!this._currentOnAir) return null;

    return this.getPrimarySourceBySceneName(this._currentOnAir?.sceneName);
  }

  public cut(): void {
    if (!this._currentPreview) {
      this.nextInput();
      return;
    }

    this._obs.call('SetCurrentProgramScene', {
      sceneName: this._currentPreview?.sceneName,
    });
  }

  public auto(): void {
    // intentionally nothing
  }

  public async changeInput(newInputIndex: number): Promise<void> {
    const scene = await this.getSceneByIndex(newInputIndex);
    this._currentPreview = scene;
    // await this.setPreviewScene(scene.sceneName);
  }

  public async nextInput(): Promise<void> {
    const scenes = await this.getScenes();
    const nextScene = scenes.find(
      (s) => s.sceneIndex === (this._currentPreview?.sceneIndex || 0) + 1,
    );
    console.log('scenes', scenes);

    console.log('goToScene', nextScene);

    if (nextScene === undefined) {
      this._currentPreview = await this.getSceneByIndex(0);
    } else {
      this._currentPreview = nextScene;
    }
    this.setPreviewScene(this._currentPreview.sceneName);
  }

  public async previousInput(): Promise<void> {
    const scenes = await this.getScenes();
    const previousScene = scenes.find(
      (s) => s.sceneIndex === (this._currentPreview?.sceneIndex || 0) - 1,
    );

    if (!previousScene) {
      this._currentPreview = await this.getSceneByIndex(scenes.length - 1);
    } else {
      this._currentPreview = previousScene;
    }
    this.setPreviewScene(this._currentPreview.sceneName);
  }

  public async toggleOverlay(overlay: number): Promise<void> {
    const scenes = await this.getScenes();

    const overlayScene = scenes.find(
      (s) => s.sceneName === 'Overlay' || s.sceneName === 'Overlays',
    );
    if (!overlayScene) {
      return;
    }

    const items = await this._obs.call('GetSceneItemList', {
      sceneName: overlayScene.sceneName,
    });

    const item = items.sceneItems.find((i) => i.sceneItemIndex === overlay - 1);

    if (!item) {
      return;
    }

    await this._obs.call('SetSceneItemEnabled', {
      sceneName: overlayScene.sceneName,
      sceneItemId: item.sceneItemId as number,
      sceneItemEnabled: !item.sceneItemEnabled,
    });
  }

  public toggleKey(key: number): void {
    void key;
  }

  public runMacro(macro: number): void {
    void macro;
  }

  public async isKeySet(key: number): Promise<boolean> {
    void key;
    return false;
  }

  public async getAuxilarySelection(aux: number): Promise<number> {
    void aux;
    return 0;
  }

  public async getSources() {
    const data = await this._obs.call('GetInputList');

    return data.inputs.map((input) => ({
      id: input.inputName as string,
      name: input.inputName as string,
    }));
  }

  public async getOnAirSources() {
    if (!this._currentOnAir) {
      return [];
    }

    return this.getSourcesBySceneName(this._currentOnAir.sceneName);
  }

  public async getPreviewSources() {
    if (!this._currentPreview) {
      return [];
    }

    return this.getSourcesBySceneName(this._currentPreview.sceneName);
  }

  public async getSourcesBySceneName(sceneName: string) {
    const sceneItems = await this._obs.call('GetSceneItemList', {
      sceneName,
    });

    return sceneItems.sceneItems
      .filter(
        (s) =>
          s.inputKind === 'av_capture_input_v2' ||
          s.inputKind === 'screen_capture' ||
          s.inputKind === 'ndi_source',
      )
      .map((s) => ({
        id: s.sourceName as string,
        name: s.sourceName as string,
      }));
  }

  private async getPrimarySourceBySceneName(sceneName: string) {
    if (!this.isConnected) return Promise.resolve(null);

    const sceneItems = await this._obs.call('GetSceneItemList', {
      sceneName,
    });

    const item = sceneItems.sceneItems
      .filter(
        (s) =>
          s.inputKind === 'av_capture_input_v2' ||
          s.inputKind === 'screen_capture' ||
          s.inputKind === 'ndi_source' ||
          s.inputKind === 'decklink-input',
      )
      .sort((a, b) => {
        // decklink-input > av_capture_input_v2 > screen_capture > ndi_source
        if (a.inputKind === 'decklink-input') {
          return -1;
        }
        if (b.inputKind === 'decklink-input') {
          return 1;
        }
        if (a.inputKind === 'av_capture_input_v2') {
          return -1;
        }
        if (b.inputKind === 'av_capture_input_v2') {
          return 1;
        }
        if (a.inputKind === 'screen_capture') {
          return -1;
        }
        if (b.inputKind === 'screen_capture') {
          return 1;
        }
        if (a.inputKind === 'ndi_source') {
          return -1;
        }
        if (b.inputKind === 'ndi_source') {
          return 1;
        }
        return 0;
      })[0];

    if (!item) {
      return null;
    }

    return {
      id: item.sourceName as string,
      name: item.sourceName as string,
    };
  }

  private sceneChanged = throttle(async () => {
    console.log('preview: ', this._currentPreview);
    console.log('onair: ', this._currentOnAir);
  }, 10);

  private async getSceneByName(name: string): Promise<Scene> {
    const scenes = await this.getScenes();
    const scene = scenes.find((s) => s.sceneName === name);

    if (!scene) {
      throw new Error(`Scene ${name} not found`);
    }

    return scene as Scene;
  }

  private async getSceneByIndex(sceneIndex: number): Promise<Scene> {
    const scenes = await this.getScenes();
    const scene = scenes.find((s) => s.sceneIndex === sceneIndex);

    if (!scene) {
      throw new Error(`Scene with index ${sceneIndex} not found`);
    }

    return scene as Scene;
  }

  private async getScenes(): Promise<Scene[]> {
    const data = await this._obs.call('GetSceneList');
    const scenes = (data.scenes as Scene[])
      .map((scene) => ({
        sceneIndex: data.scenes.length - scene.sceneIndex - 1,
        sceneName: scene.sceneName,
      }))
      .reverse();

    return scenes;
  }

  private async setPreviewScene(sceneName: string): Promise<void> {
    await this._obs.call('SetCurrentPreviewScene', {
      sceneName,
    });
  }
}
