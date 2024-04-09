import { ZodObject, ZodSchema } from 'zod';

export interface IBuilder<TConcrete> {
  supportedTypes(): Promise<string[]>;
  validationSchema(): ZodObject<any>;
  build(config: Record<string, unknown>): Promise<TConcrete>;
}
