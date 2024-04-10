import { z } from 'zod';
import { IVideoMixer, baseVideoMixerSchema } from '../IVideoMixer';
import { VideoMixerType } from '../VideoMixerType';
import { Connection } from 'node-vmix';
import { XmlApi } from 'vmix-js-utils';

type Scene = {
  sceneName: string;
  sceneIndex: number;
};

export const vMixConfigSchema = baseVideoMixerSchema.extend({
  type: z.literal(VideoMixerType.Vmix),
  password: z.string().nullable(),
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

  public get isConnected(): boolean {
    return this._isConnected;
  }

  public set isConnected(value: boolean) {
    this._isConnected = value;
  }

  constructor(private _config: VmixConfig) {
    this.connect(_config);
  }

  private connect(config: VmixConfig) {
    this._connection = new Connection(config.ip, { debug: true, autoReconnect: true });

    this._connection.on('xml', (xmlData) => {
      const xmlContent = XmlApi.DataParser.parse(xmlData);

      // Extract input data and
      // manipulate to desired format
      const inputsRawData = XmlApi.Inputs.extractInputsFromXML(xmlContent);
      const inputs = XmlApi.Inputs.map(inputsRawData);

      console.log('inputs', inputs);

      // Your logic here!
      // See example to parse the XML correctly
      console.log('xml', xmlData);
    });

    // Listener for tally
    this._connection.on('tally', (tally) => {
      // Your logic here!
      console.log('tally', tally);
    });

    // Listener for data such as tally
    this._connection.on('data', (data) => {
      console.log('data', data);
      // Your logic here!
    });

    this._connection.on('connect', () => {
      // Request vMix API XML state by sending message 'XML'
      this._connection.send('XML');

      // Request vMix tally info by sending message 'TALLY'
      this._connection.send('TALLY');
    });

    setInterval(() => {
      this.isConnected = this._connection.connected();
    }, 1000);
  }

  public getSources() {
    // Your logic here!
  }
}
