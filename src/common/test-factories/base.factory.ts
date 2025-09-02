import { DeepPartial } from 'typeorm';

/**
 * Base factory class providing common functionality for entity factories
 */
export abstract class BaseFactory<T> {
  /**
   * Creates a single entity with optional overrides
   */
  abstract create(overrides?: DeepPartial<T>): T;

  /**
   * Creates multiple entities with optional overrides for each
   */
  createMany(count: number, overrides?: DeepPartial<T>[]): T[] {
    const entities: T[] = [];
    for (let i = 0; i < count; i++) {
      const entityOverrides = overrides?.[i] || ({} as DeepPartial<T>);
      entities.push(this.create(entityOverrides));
    }
    return entities;
  }

  /**
   * Merges default values with provided overrides
   */
  protected mergeWithDefaults(defaults: T, overrides?: DeepPartial<T>): T {
    return { ...defaults, ...overrides } as T;
  }

  /**
   * Generates a unique UUID for testing
   */
  protected generateUuid(): string {
    return `test-uuid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generates a timestamp for testing
   */
  protected generateTimestamp(): Date {
    return new Date();
  }
}
