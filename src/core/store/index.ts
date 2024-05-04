import electron from 'electron';
import path from 'path';
import fs from 'fs';
import { ZodRawShape, z } from 'zod';
import { getValueAtPath, setValueAtPath } from '../../main/utils/objectHelpers';

type StoreOptions<T, Schema extends z.ZodObject<any> | undefined> = {
  configName: string;
  defaults: Schema extends z.ZodObject<any> ? z.infer<Schema> : T;
  schema?: Schema;
  migrations?: {
    [version: number]: (data: any) => any;
  };
  version?: number;
};

export class Store<T, Schema extends z.ZodObject<any> | undefined> {
  path: string;
  data: (Schema extends z.ZodObject<ZodRawShape> ? z.infer<Schema> : T) & { _version?: number };
  schema?: Schema;
  version?: number;
  migrations?: { [version: number]: (data: any) => any };

  constructor(opts: StoreOptions<T, Schema>) {
    this.schema = opts.schema;
    this.version = opts.version;
    this.migrations = opts.migrations;
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path. (electron.app || electron.remote.app)

    const userDataPath = electron.app.getPath('userData');

    console.log('userDataPath', userDataPath);
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    this.path = path.join(userDataPath, opts.configName + '.json');

    // @ts-ignore
    this.data = this.parseDataFile(this.path, opts.defaults, opts.schema);
  }

  // This will just return the property on the `data` object
  get<K extends keyof typeof this.data>(key: K): (typeof this.data)[K] {
    const data = this.data[key];
    if (Array.isArray(data)) {
      return [...data] as (typeof this.data)[K];
    }
    if (typeof data === 'object') {
      return {
        ...data,
      };
    }
    return data;
  }

  // ...and this will set it
  set<K extends keyof typeof this.data>(key: K, val: (typeof this.data)[K]): void {
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

  private parseDataFile<
    T,
    Schema extends z.ZodObject<{ version: z.ZodNumber }> | undefined = undefined,
  >(
    filePath: string,
    defaults: Schema extends z.ZodObject<ZodRawShape> ? z.infer<Schema> : T,
    schema?: Schema,
  ): typeof this.data {
    // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
    // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
    try {
      console.log('parseDataFile', filePath);
      // check if the file exists
      console.log('fs.existsSync(filePath)', fs.existsSync(filePath));
      if (!fs.existsSync(filePath)) {
        if (this.version !== undefined) {
          return { ...defaults, _version: this.version } as typeof this.data;
        }

        return defaults as typeof this.data;
      }

      let data = JSON.parse(fs.readFileSync(filePath).toString());

      const version = data._version !== undefined ? data._version : -1;
      const migrationVersions = Object.keys(this.migrations || {})
        .map((v) => parseInt(v))
        .filter((v) => v > version)
        .sort();

      migrationVersions.forEach((migration) => {
        data = this.migrations![migration](data);
        data._version = migration;
      });

      if (migrationVersions.length > 0) {
        fs.writeFileSync(filePath, JSON.stringify(data));
      }

      // apply default for any missing keys
      for (const key in defaults) {
        if (data[key] === undefined) {
          data[key] = defaults[key];
        }
      }

      if (!schema) {
        return data as typeof this.data;
      }

      const result = schema.safeParse(data);

      if (!result.success) {
        // if there were any errors, apply the defaults for those keys
        for (const error of result.error.errors) {
          setValueAtPath(data, error.path, getValueAtPath(defaults, error.path));
        }

        schema.parse(data);
      }

      return data as typeof this.data;
    } catch (error) {
      console.log('parseDataFile error', error);
      // if there was some kind of error, return the passed in defaults instead.
      return defaults as typeof this.data;
    }
  }
}
