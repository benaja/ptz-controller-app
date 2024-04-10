import { Store } from '@core/store';
import { ZodSchema, z } from 'zod';
import { randomUUID } from 'crypto';

export class Repository<T extends { id: string }> {
  private items: T[] = [];
  private schema: ZodSchema<T>;
  private store: Store<
    {
      values: T[];
    },
    z.ZodObject<{
      values: z.ZodArray<ZodSchema<T>>;
    }>
  >;

  constructor(configName: string, schema: ZodSchema<T>) {
    this.schema = schema;
    const store = new Store({
      configName,
      schema: z.object({
        values: z.array(schema),
      }),
      defaults: {
        values: [],
      },
    });
    this.store = store;
  }

  getAll(): T[] {
    return this.store.get('values');
  }

  getById(id: string): T | undefined {
    return this.store.get('values').find((c) => c.id === id);
  }

  add(item: Partial<T>): T {
    const values = this.store.get('values');
    // Validate item with Zod schema
    const validatedItem = this.schema.parse({
      ...item,
      id: randomUUID(),
    });
    values.push(validatedItem);
    this.store.set('values', values);
    return validatedItem;
  }

  update(id: string, updatedItem: Partial<T>): T | undefined {
    const items = this.store.get('values');
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error('Item not found');
    }

    // Validate updatedItem with Zod schema
    const validatedItem = this.schema.parse(updatedItem);
    items[index] = { ...items[index], ...validatedItem };
    this.store.set('values', items);
    return items[index] as T;
  }

  delete(id: string): void {
    const items = this.store.get('values');
    const index = items.findIndex((item) => (item as any).id === id);
    if (index !== -1) {
      items.splice(index, 1);
    }
    this.store.set('values', items);
  }
}
