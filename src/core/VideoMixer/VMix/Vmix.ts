import { z } from 'zod';
import { IVideoMixer, baseVideoMixerSchema } from '../IVideoMixer';
import { VideoMixerType } from '../VideoMixerType';
import { Connection } from 'node-vmix';
import { XmlApi } from 'vmix-js-utils';
import { TallyHub } from '@core/Tally/TallyHub';
import { CameraFactory } from '@core/CameraConnection/CameraFactory';
import { ITallyHub } from '@core/Tally/ITallyHub';

type Scene = {
  sceneName: string;
  sceneIndex: number;
};

export const vMixConfigSchema = baseVideoMixerSchema.extend({
  type: z.literal(VideoMixerType.Vmix),
  password: z.string().nullable(),
  ip: z.string(),
});

export type VmixConfig = z.infer<typeof vMixConfigSchema>;

export class Vmix implements IVideoMixer {
  public readonly name = VideoMixerType.Vmix;
  public readonly label = 'Vmix';
  public static readonly type = VideoMixerType.OBS;

  private _currentOnAir: Scene | null = null;
  private _currentPreview: Scene | null = null;
  private _isConnected = false;
  private _connection: Connection;
  private _tallyState: string;
  private _tallyInterval: NodeJS.Timeout | null;

  private _xmlData: Document | null = null;
  private _dataInterval: NodeJS.Timeout | null;

  private _tallyHub: ITallyHub;

  public get isConnected(): boolean {
    return this._isConnected;
  }

  public set isConnected(value: boolean) {
    this._isConnected = value;
  }

  constructor(private _config: VmixConfig, private _cameraFactory: CameraFactory) {
    this.connect(_config);

    this._tallyHub = new TallyHub(_cameraFactory, this);
  }

  public connect(config: VmixConfig) {
    this._connection = new Connection(config.ip, { debug: false, autoReconnect: true });

    this._connection.on('close', () => {
      if (this._tallyInterval) {
        clearInterval(this._tallyInterval);
        this._tallyInterval = null;
      }

      if (this._dataInterval) {
        clearInterval(this._dataInterval);
        this._dataInterval = null;
      }

      console.log('close');
    });

    this._connection.on('error', (error) => {
      console.error('error', error);
    });

    // Listener for tally
    this._connection.on('tally', async (tally) => {
      if (this._tallyState === tally) return;
      this._tallyState = tally;

      if (!this._connection.connected()) return;

      this._xmlData = await this.getXmlData();

      this._tallyHub.updateTally();
    });

    this._connection.on('connect', () => {
      // Request vMix API XML state by sending message 'XML'
      this._connection.send('XML');

      // Request vMix tally info by sending message 'TALLY'
      this._connection.send('TALLY');

      this._tallyInterval = setInterval(() => {
        if (!this._connection.connected()) return;

        this._connection.send('TALLY');
      }, 100);

      this._dataInterval = setInterval(async () => {
        if (!this._connection.connected()) return;

        this._xmlData = await this.getXmlData();
      }, 5000);
    });

    setInterval(() => {
      this.isConnected = this._connection.connected();
    }, 1000);
  }

  public async getSources() {
    if (!this._xmlData) return [];

    const inputsRawData = XmlApi.Inputs.extractInputsFromXML(this._xmlData);
    const inputs = XmlApi.Inputs.map(inputsRawData);
    return inputs.map((input) => ({
      id: input.number + '',
      name: input.title,
    }));
  }

  public async getPreview() {
    if (!this._xmlData) return null;

    const preview = XmlApi.Inputs.extractPreviewInputNumber(this._xmlData);

    const sources = await this.getSources();
    return sources.find((source) => source.id == `${preview}`) ?? null;
  }

  public async getOnAir() {
    if (!this._xmlData) return null;

    const program = XmlApi.Inputs.extractProgramInputNumber(this._xmlData);

    const sources = await this.getSources();
    return sources.find((source) => source.id == `${program}`) ?? null;
  }

  public async getPreviewSources() {
    if (!this._xmlData) return [];

    const tally = XmlApi.Inputs.mapTallyInfo(this._xmlData);

    const sources = await this.getSources();

    return sources.filter((source) => tally.preview.includes(parseInt(source.id)));
  }

  public async getOnAirSources() {
    if (!this._xmlData) return [];

    const tally = XmlApi.Inputs.mapTallyInfo(this._xmlData);

    const sources = await this.getSources();

    return sources.filter((source) => tally.program.includes(parseInt(source.id)));
  }

  private getXmlData() {
    if (!this._connection.connected()) return Promise.resolve(null);

    return new Promise<Document>((resolve) => {
      const onReceiveData = (xmlData: any) => {
        const xmlContent = XmlApi.DataParser.parse(xmlData);

        resolve(xmlContent);
      };

      this._connection.on('xml', onReceiveData);
      this._connection.send('XML');
    });
  }

  cut() {
    this._connection.send({ Function: 'Cut' });
    // connection2.send({ Function: 'Merge' });
  }
  async changeInput() {}
  async nextInput() {
    const preview = await this.getPreview();
    let next = parseInt(preview?.id || '0') + 1;
    const sources = await this.getSources();
    if (next >= sources.length) {
      next = 0;
    }

    this._connection.send({ Function: 'PreviewInput', Input: next });
  }
  async previousInput() {
    const preview = await this.getPreview();
    let previous = parseInt(preview?.id || '0') - 1;
    const sources = await this.getSources();
    if (previous === 0) {
      previous = sources.length - 1;
    }

    this._connection.send({ Function: 'PreviewInput', Input: previous });
  }
  toggleKey() {}
  runMacro() {}
  async isKeySet() {
    return false;
  }
  async getAuxilarySelection() {
    return 0;
  }
  dispose() {
    this._connection.shutdown();
  }

  toggleOverlay(number: number) {
    console.log('toggleOverlay', number);
    this._connection.send({ Function: 'OverlayInput' + number + 'Last' });
  }

  // private async getSourcesByTallyInfo(state: '0' | '1' | '2') {
  //   if (!this._tallyState) return null;

  //   const sources = await this.getSources();
  //   return this._tallyState
  //     .split('')
  //     .map((s, index) => {
  //       if (s === state) {
  //         return sources[index];
  //       }
  //       return null;
  //     })
  //     .filter((s) => s !== null);
  // }
}
