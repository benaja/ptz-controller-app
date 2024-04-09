import { ZodObject, ZodSchema } from 'zod';
import { IBuilder } from './IBuilder';
import { IDisposable } from './IDisposable';

export type FactoryConfig = Record<string, unknown> & { id: string; type: string };

export class Factory<TConcrete extends IDisposable> implements IDisposable {
  protected _builders: { [key: string]: IBuilder<TConcrete> } = {};
  public _instances: { [key: string]: TConcrete } = {};

  public async addBuilder(builder: IBuilder<TConcrete>): Promise<void> {
    const types = await builder.supportedTypes();
    console.log('Adding builder', types);
    for (const type of types) {
      this._builders[type] = builder;
    }
    console.log('Added builder', this._builders);
  }

  public async build(configs: FactoryConfig[]) {
    // console.log('Building factory', configs, this._builders);
    this._instances = {};
    for (const config of configs) {
      if (!this._builders[config.type]) {
        throw new Error(`No builder for type ${config.type}`);
      }
      const instance = await this._builders[config.type].build(config);
      this._instances[config.id] = instance;
    }
  }

  public get instances(): TConcrete[] {
    return Object.values(this._instances);
  }

  public get(id: string): TConcrete | undefined {
    return this._instances[id];
  }

  public async add(config: FactoryConfig): Promise<void> {
    if (this._instances[config.id]) {
      throw new Error(`Instance with id ${config.id} already exists`);
    }

    const instance = await this._builders[config.type].build(config);
    this._instances[config.id] = instance;
  }

  public async remove(id: string): Promise<void> {
    if (!this._instances[id]) {
      throw new Error(`Instance with id ${id} does not exist`);
    }

    const instance = this._instances[id];
    await this.disposeInstance(instance);
    delete this._instances[id];
  }

  public async dispose(): Promise<void> {
    for (const key in Object.keys(this._instances)) {
      await this.disposeInstance(this._instances[key]);
    }
    this._instances = {};
  }

  public validationSchemas(): ZodObject<any>[] {
    return Object.values(this._builders).map((b) => b.validationSchema());
  }

  public validationSchema(type: string): ZodObject<any> {
    const schema = this._builders[type]?.validationSchema();

    if (!schema) {
      throw new Error(`Gamepad type ${type} not supported`);
    }

    return schema;
  }

  private async disposeInstance(instance: TConcrete): Promise<void> {
    try {
      await instance.dispose();
    } catch (_error) {
      // catch left empty on purpose, as we dispose on best effort
    }
  }
}
