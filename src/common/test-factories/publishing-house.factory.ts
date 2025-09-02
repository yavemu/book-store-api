import { DeepPartial } from 'typeorm';
import { PublishingHouse } from '../../modules/publishing-houses/entities/publishing-house.entity';
import { BaseFactory } from './base.factory';

/**
 * Factory for creating PublishingHouse entities for testing
 */
export class PublishingHouseFactory extends BaseFactory<PublishingHouse> {
  create(overrides?: DeepPartial<PublishingHouse>): PublishingHouse {
    const now = this.generateTimestamp();
    const defaults: PublishingHouse = {
      id: this.generateUuid(),
      name: `Publisher${Date.now()}`,
      country: 'United States',
      websiteUrl: 'https://example-publisher.com',
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    return this.mergeWithDefaults(defaults, overrides);
  }

  /**
   * Creates Penguin Random House
   */
  createPenguinRandomHouse(overrides?: DeepPartial<PublishingHouse>): PublishingHouse {
    return this.create({
      name: 'Penguin Random House',
      country: 'United States',
      websiteUrl: 'https://www.penguinrandomhouse.com',
      ...overrides,
    });
  }

  /**
   * Creates HarperCollins Publishers
   */
  createHarperCollins(overrides?: DeepPartial<PublishingHouse>): PublishingHouse {
    return this.create({
      name: 'HarperCollins Publishers',
      country: 'United States',
      websiteUrl: 'https://www.harpercollins.com',
      ...overrides,
    });
  }

  /**
   * Creates Macmillan Publishers
   */
  createMacmillan(overrides?: DeepPartial<PublishingHouse>): PublishingHouse {
    return this.create({
      name: 'Macmillan Publishers',
      country: 'United Kingdom',
      websiteUrl: 'https://www.macmillan.com',
      ...overrides,
    });
  }

  /**
   * Creates Simon & Schuster
   */
  createSimonSchuster(overrides?: DeepPartial<PublishingHouse>): PublishingHouse {
    return this.create({
      name: 'Simon & Schuster',
      country: 'United States',
      websiteUrl: 'https://www.simonandschuster.com',
      ...overrides,
    });
  }

  /**
   * Creates a publisher without optional fields
   */
  createMinimal(overrides?: DeepPartial<PublishingHouse>): PublishingHouse {
    return this.create({
      country: undefined,
      websiteUrl: undefined,
      ...overrides,
    });
  }

  /**
   * Creates a publisher from a specific country
   */
  createWithCountry(country: string, overrides?: DeepPartial<PublishingHouse>): PublishingHouse {
    return this.create({
      country,
      ...overrides,
    });
  }
}
