import OBSWebSocket from 'obs-websocket-js';
import { throttle } from '@main/utils/throttle';
import { IVideoMixer, baseVideoMixerSchema } from '../IVideoMixer';
import { z } from 'zod';
import { VideoMixerType } from '../VideoMixerType';

type Scene = {
  sceneName: string;
  sceneIndex: number;
};

export const obsMixerConfigSchema = baseVideoMixerSchema.extend({
  // type: z.literal(VideoMixerType.OBS),
  password: z.string().nullable(),
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

  public get isConnected(): boolean {
    return this._isConnected;
  }

  public set isConnected(value: boolean) {
    this._isConnected = value;
  }

  constructor(private _config: ObsMixerConfig) {
    this._obs = new OBSWebSocket();
    this.connect(_config);
  }

  public connect(config: ObsMixerConfig) {
    // console.log('connecting to OBS', config.ip);
    this._obs
      .connect(`ws://${config.ip}`, config.password || undefined)
      .then(() => {
        this.isConnected = true;
        console.log(`Successfully connected to OBS!`);

        this._obs.on('CurrentPreviewSceneChanged', async (data) => {
          await this.previewSceneChanged();
          const preview = await this.getSceneByName(data.sceneName);
          console.log('preview', preview);
          // console.log(data);
          // this._currentPreview = await this.getSceneByName(data.sceneName);
          // this.sceneChanged();
        });
        this._obs.on('CurrentProgramSceneChanged', async (data) => {
          this._currentOnAir = await this.getSceneByName(data.sceneName);
          this.sceneChanged();
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

  public getPreview(): number {
    return (this._currentPreview?.sceneIndex || 0) + 1;
  }

  public getOnAir(): number {
    return (this._currentOnAir?.sceneIndex || 0) + 1;
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

  public toggleKey(key: number): void {
    // intentionally nothing
  }

  public runMacro(macro: number): void {
    // intentionally nothing
  }

  public async isKeySet(key: number): Promise<boolean> {
    return false;
  }

  public async getAuxilarySelection(aux: number): Promise<number> {
    return 0;
  }

  private sceneChanged = throttle(async () => {
    console.log('preview: ', this._currentPreview);
    console.log('onair: ', this._currentOnAir);
  }, 10);

  private async previewSceneChanged() {
    const data = await this._obs.call('GetCurrentPreviewScene');
    console.log('previewSceneChanged', data);
    // this._currentPreview = await this.getSceneByName(data.name);
  }

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
      throw new Error(`Scene ${name} not found`);
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
