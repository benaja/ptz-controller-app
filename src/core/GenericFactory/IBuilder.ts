import { ZodObject, ZodSchema, ZodUnion } from 'zod';

export interface IBuilder<TConcrete> {
  supportedTypes(): string[];
  validationSchema(): ZodObject<any> | ZodUnion<any>;
  build(config: Record<string, unknown>): Promise<TConcrete>;
}
