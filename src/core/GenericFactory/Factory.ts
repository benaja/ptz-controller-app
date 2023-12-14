import { IBuilder } from './IBuilder';
import { IDisposable } from './IDisposable';

type Config = Record<string, unknown> & { id: string };

export class Factory<TConcrete extends IDisposable> implements IDisposable {
  protected _builders: { [key: string]: IBuilder<TConcrete> } = {};
  public _instances: { [key: string]: TConcrete } = {};
  private _builder: IBuilder<TConcrete>;

  constructor(builder: IBuilder<TConcrete>) {
    this._builder = builder;
  }

  public async build(configs: Config[]) {
    this._instances = {};
    for (const config of configs) {
      const instance = await this._builder.build(config);
      this._instances[config.id] = instance;
    }
  }

  public get(id: string): TConcrete | undefined {
    return this._instances[id];
  }

  public async add(config: Config): Promise<void> {
    const instance = await this._builder.build(config);
    this._instances[config.id] = instance;
  }

  public async remove(id: string): Promise<void> {
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

  private async disposeInstance(instance: TConcrete): Promise<void> {
    try {
      await instance.dispose();
    } catch (_error) {
      // catch left empty on purpose, as we dispose on best effort
    }
  }
}
