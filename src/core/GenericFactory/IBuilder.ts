import { ZodObject, ZodSchema } from 'zod';

export interface IBuilder<TConcrete> {
  supportedTypes(): string[];
  validationSchema(type: string): ZodObject<any>;
  build(config: Record<string, unknown>): Promise<TConcrete>;
}
