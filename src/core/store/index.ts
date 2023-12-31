import electron from 'electron';
import path from 'path';
import fs from 'fs';
import { UserConfig, userConfigSchema } from './userStore';
import { VideoMixerType } from '../../main/VideoMixer';
import { ZodRawShape, z } from 'zod';
import { getValueAtPath, setValueAtPath } from '../../main/utils/objectHelpers';

export class Store<T extends Record<string | number | symbol, unknown>> {
  path: string;
  data: T;
  schema?: z.ZodObject<ZodRawShape>;

  constructor(opts: { configName: string; defaults: T; schema?: z.ZodObject<ZodRawShape> }) {
    this.schema = opts.schema;
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path. (electron.app || electron.remote.app)

    const userDataPath = electron.app.getPath('userData');
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    this.path = path.join(userDataPath, opts.configName + '.json');

    this.data = parseDataFile(this.path, opts.defaults, opts.schema);
  }

  // This will just return the property on the `data` object
  get<K extends keyof T>(key: K): T[K] {
    const data = this.data[key];
    if (Array.isArray(data)) {
      return [...data] as T[K];
    }
    if (typeof data === 'object') {
      return {
        ...data,
      };
    }
    return data;
  }

  // ...and this will set it
  set<K extends keyof T>(key: K, val: T[K]): void {
    if (this.schema) {
      // @ts-expect-error key is a string, but we need it to be a keyof T
      this.schema.pick({ [key]: true }).parse({ [key]: val });
    }
    this.data[key] = val;
    // Wait, I thought using the node.js' synchronous APIs was bad form?
    // We're not writing a server so there's not nearly the same IO demand on the process
    // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
    // we might lose that data. Note that in a real app, we would try/catch this.
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile<T>(filePath: string, defaults: T, schema?: z.ZodObject<ZodRawShape>): T {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
  try {
    console.log('parseDataFile', filePath);
    const data = JSON.parse(fs.readFileSync(filePath).toString());

    // apply default for any missing keys
    for (const key in defaults) {
      if (data[key] === undefined) {
        data[key] = defaults[key];
      }
    }

    if (!schema) {
      return data as T;
    }

    const result = schema.safeParse(data);

    if (!result.success) {
      // if there were any errors, apply the defaults for those keys
      for (const error of result.error.errors) {
        setValueAtPath(data, error.path, getValueAtPath(defaults, error.path));
      }

      schema.parse(data);
    }

    return data as T;
  } catch (error) {
    console.log('parseDataFile error', error);
    // if there was some kind of error, return the passed in defaults instead.
    return defaults;
  }
}
