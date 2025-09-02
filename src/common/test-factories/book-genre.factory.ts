import { DeepPartial } from 'typeorm';
import { BookGenre } from '../../modules/book-genres/entities/book-genre.entity';
import { BaseFactory } from './base.factory';

/**
 * Factory for creating BookGenre entities for testing
 */
export class BookGenreFactory extends BaseFactory<BookGenre> {
  create(overrides?: DeepPartial<BookGenre>): BookGenre {
    const now = this.generateTimestamp();
    const defaults: BookGenre = {
      id: this.generateUuid(),
      name: `Genre${Date.now()}`,
      description: 'A compelling genre with interesting characteristics.',
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    return this.mergeWithDefaults(defaults, overrides);
  }

  /**
   * Creates a Fiction genre
   */
  createFiction(overrides?: DeepPartial<BookGenre>): BookGenre {
    return this.create({
      name: 'Fiction',
      description: 'Literary works that are imaginary rather than factual',
      ...overrides,
    });
  }

  /**
   * Creates a Mystery genre
   */
  createMystery(overrides?: DeepPartial<BookGenre>): BookGenre {
    return this.create({
      name: 'Mystery',
      description: 'Stories involving puzzles, crimes, or unexplained events',
      ...overrides,
    });
  }

  /**
   * Creates a Romance genre
   */
  createRomance(overrides?: DeepPartial<BookGenre>): BookGenre {
    return this.create({
      name: 'Romance',
      description: 'Stories focused on love and relationships',
      ...overrides,
    });
  }

  /**
   * Creates a Science Fiction genre
   */
  createSciFi(overrides?: DeepPartial<BookGenre>): BookGenre {
    return this.create({
      name: 'Science Fiction',
      description: 'Speculative fiction dealing with futuristic concepts',
      ...overrides,
    });
  }

  /**
   * Creates a Fantasy genre
   */
  createFantasy(overrides?: DeepPartial<BookGenre>): BookGenre {
    return this.create({
      name: 'Fantasy',
      description: 'Fiction involving magical or supernatural elements',
      ...overrides,
    });
  }

  /**
   * Creates a genre without description
   */
  createMinimal(overrides?: DeepPartial<BookGenre>): BookGenre {
    return this.create({
      description: undefined,
      ...overrides,
    });
  }
}
