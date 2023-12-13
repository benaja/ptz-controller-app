export interface IBuilder<TConcrete> {
  supportedTypes(): Promise<string[]>;
  build(config: Record<string, unknown>): Promise<TConcrete>;
}
