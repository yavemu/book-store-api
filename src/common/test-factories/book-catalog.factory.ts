import { DeepPartial } from 'typeorm';
import { BookCatalog } from '../../modules/book-catalog/entities/book-catalog.entity';
import { BaseFactory } from './base.factory';
import { BookGenreFactory } from './book-genre.factory';
import { PublishingHouseFactory } from './publishing-house.factory';

/**
 * Factory for creating BookCatalog entities for testing
 */
export class BookCatalogFactory extends BaseFactory<BookCatalog> {
  private genreFactory = new BookGenreFactory();
  private publisherFactory = new PublishingHouseFactory();

  create(overrides?: DeepPartial<BookCatalog>): BookCatalog {
    const now = this.generateTimestamp();
    const genre = this.genreFactory.create();
    const publisher = this.publisherFactory.create();

    const defaults: BookCatalog = {
      id: this.generateUuid(),
      title: `Test Book ${Date.now()}`,
      isbnCode: this.generateISBN(),
      price: 19.99,
      isAvailable: true,
      stockQuantity: 10,
      coverImageUrl: 'https://example.com/book-cover.jpg',
      publicationDate: new Date('2023-01-01'),
      pageCount: 300,
      summary: 'An engaging book with a compelling storyline.',
      genreId: genre.id,
      publisherId: publisher.id,
      genre: genre,
      publisher: publisher,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    return this.mergeWithDefaults(defaults, overrides);
  }

  /**
   * Creates a book with specific genre and publisher
   */
  createWithGenreAndPublisher(
    genreId: string,
    publisherId: string,
    overrides?: DeepPartial<BookCatalog>,
  ): BookCatalog {
    return this.create({
      genreId,
      publisherId,
      genre: this.genreFactory.create({ id: genreId }),
      publisher: this.publisherFactory.create({ id: publisherId }),
      ...overrides,
    });
  }

  /**
   * Creates a fiction book
   */
  createFictionBook(overrides?: DeepPartial<BookCatalog>): BookCatalog {
    const genre = this.genreFactory.createFiction();
    return this.create({
      title: 'The Great Adventure',
      genreId: genre.id,
      genre: genre,
      summary: 'A thrilling fiction novel that will keep you on the edge of your seat.',
      ...overrides,
    });
  }

  /**
   * Creates a mystery book
   */
  createMysteryBook(overrides?: DeepPartial<BookCatalog>): BookCatalog {
    const genre = this.genreFactory.createMystery();
    return this.create({
      title: 'The Vanishing Clue',
      genreId: genre.id,
      genre: genre,
      summary: 'A captivating mystery that will challenge your detective skills.',
      ...overrides,
    });
  }

  /**
   * Creates an out of stock book
   */
  createOutOfStock(overrides?: DeepPartial<BookCatalog>): BookCatalog {
    return this.create({
      isAvailable: false,
      stockQuantity: 0,
      ...overrides,
    });
  }

  /**
   * Creates an expensive book
   */
  createExpensive(overrides?: DeepPartial<BookCatalog>): BookCatalog {
    return this.create({
      price: 99.99,
      title: 'Premium Edition Book',
      ...overrides,
    });
  }

  /**
   * Creates a book with minimal fields
   */
  createMinimal(overrides?: DeepPartial<BookCatalog>): BookCatalog {
    return this.create({
      coverImageUrl: undefined,
      publicationDate: undefined,
      pageCount: undefined,
      summary: undefined,
      ...overrides,
    });
  }

  /**
   * Creates a book with specific stock quantity
   */
  createWithStock(stockQuantity: number, overrides?: DeepPartial<BookCatalog>): BookCatalog {
    return this.create({
      stockQuantity,
      isAvailable: stockQuantity > 0,
      ...overrides,
    });
  }

  /**
   * Generates a valid ISBN-13 code for testing
   */
  private generateISBN(): string {
    const timestamp = Date.now().toString();
    const randomSuffix = Math.random().toString().substr(2, 4);
    return `978${timestamp.substr(-6)}${randomSuffix}`.substr(0, 13);
  }
}
