import electron from 'electron';
import path from 'path';
import fs from 'fs';
import { UserConfig } from './userConfig';
import { VideoMixerType } from './VideoMixer';

export class Store<T extends Record<string, unknown>> {
  path: string;
  data: T;

  constructor(opts: { configName: string; defaults: T }) {
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path.
    const userDataPath = electron.app.getPath('userData');
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    this.path = path.join(userDataPath, opts.configName + '.json');

    this.data = parseDataFile(this.path, opts.defaults);
  }

  // This will just return the property on the `data` object
  get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }

  // ...and this will set it
  set<K extends keyof T>(key: K, val: T[K]): void {
    this.data[key] = val;
    // Wait, I thought using the node.js' synchronous APIs was bad form?
    // We're not writing a server so there's not nearly the same IO demand on the process
    // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
    // we might lose that data. Note that in a real app, we would try/catch this.
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile<T>(filePath, defaults): T {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
  try {
    const data = JSON.parse(fs.readFileSync(filePath).toString());

    for (const key in defaults) {
      if (data[key] === undefined) {
        data[key] = defaults[key];
      }
    }

    return data as T;
  } catch (error) {
    // if there was some kind of error, return the passed in defaults instead.
    return defaults;
  }
}

export const userConfigStore = new Store<UserConfig>({
  configName: 'userConfig',
  defaults: {
    cams: [
      {
        id: 1,
        ip: '192.168.0.31',
        port: '/dev/ttyACM0',
      },
    ],
    videoMixers: [
      {
        type: VideoMixerType.Obs,
        instance: 1,
        ip: '192.168.1.112',
        mixEffectBlock: 0,
      },
    ],
    selectedGamepads: {
      primaryGamepad: null,
      secondaryGamepad: null,
    },
  },
});
