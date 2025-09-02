import { DeepPartial } from 'typeorm';
import { BookAuthor } from '../../modules/book-authors/entities/book-author.entity';
import { BaseFactory } from './base.factory';

/**
 * Factory for creating BookAuthor entities for testing
 */
export class BookAuthorFactory extends BaseFactory<BookAuthor> {
  create(overrides?: DeepPartial<BookAuthor>): BookAuthor {
    const now = this.generateTimestamp();
    const defaults: BookAuthor = {
      id: this.generateUuid(),
      firstName: 'John',
      lastName: 'Doe',
      nationality: 'American',
      birthDate: new Date('1970-01-01'),
      biography: 'A renowned author with numerous bestselling novels.',
      email: `author${Date.now()}@example.com`,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    return this.mergeWithDefaults(defaults, overrides);
  }

  /**
   * Creates a well-known author (Stephen King)
   */
  createStephenKing(overrides?: DeepPartial<BookAuthor>): BookAuthor {
    return this.create({
      firstName: 'Stephen',
      lastName: 'King',
      nationality: 'American',
      birthDate: new Date('1947-09-21'),
      biography: 'Renowned horror novelist',
      email: 'stephen.king@example.com',
      ...overrides,
    });
  }

  /**
   * Creates a well-known author (J.K. Rowling)
   */
  createJKRowling(overrides?: DeepPartial<BookAuthor>): BookAuthor {
    return this.create({
      firstName: 'J.K.',
      lastName: 'Rowling',
      nationality: 'British',
      birthDate: new Date('1965-07-31'),
      biography: 'Author of Harry Potter series',
      email: 'jk.rowling@example.com',
      ...overrides,
    });
  }

  /**
   * Creates an author without optional fields
   */
  createMinimal(overrides?: DeepPartial<BookAuthor>): BookAuthor {
    return this.create({
      nationality: undefined,
      birthDate: undefined,
      biography: undefined,
      email: undefined,
      ...overrides,
    });
  }

  /**
   * Creates an author from a specific nationality
   */
  createWithNationality(nationality: string, overrides?: DeepPartial<BookAuthor>): BookAuthor {
    return this.create({
      nationality,
      ...overrides,
    });
  }
}
