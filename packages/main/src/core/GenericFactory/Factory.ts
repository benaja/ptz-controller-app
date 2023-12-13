import { IBuilder } from './IBuilder';
import { IDisposable } from './IDisposable';

export class Factory<TConcrete extends IDisposable> implements IDisposable {
  protected _builders: { [key: string]: IBuilder<TConcrete> } = {};
  public _instances: { [key: number]: TConcrete } = {};

  public get(instance: number): TConcrete | undefined {
    return this._instances[`${instance}`];
  }

  public async builderAdd(builder: IBuilder<TConcrete>): Promise<void> {
    try {
      const supportedTypes = await builder.supportedTypes();
      supportedTypes.forEach((type) => {
        if (this._builders[type] === undefined) {
          this._builders[type] = builder;
        }
      });
    } catch (error) {
      console.error(`Factory: Failed to add builder - ${error}`);
    }
  }

  public async dispose(): Promise<void> {
    for (const key in this._instances) {
      if (Object.prototype.hasOwnProperty.call(this._instances, key)) {
        try {
          await this._instances[key].dispose();
        } catch (_error) {
          // catch left empty on purpose, as we dispose on best effort
        }
      }
    }
  }
}
