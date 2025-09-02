import { DeepPartial } from 'typeorm';
import { BookAuthorAssignment } from '../../modules/book-author-assignments/entities/book-author-assignment.entity';
import { BaseFactory } from './base.factory';
import { BookCatalogFactory } from './book-catalog.factory';
import { BookAuthorFactory } from './book-author.factory';

/**
 * Factory for creating BookAuthorAssignment entities for testing
 */
export class BookAuthorAssignmentFactory extends BaseFactory<BookAuthorAssignment> {
  private bookFactory = new BookCatalogFactory();
  private authorFactory = new BookAuthorFactory();

  create(overrides?: DeepPartial<BookAuthorAssignment>): BookAuthorAssignment {
    const now = this.generateTimestamp();
    const book = this.bookFactory.create();
    const author = this.authorFactory.create();

    const defaults: BookAuthorAssignment = {
      id: this.generateUuid(),
      bookId: book.id,
      authorId: author.id,
      book: book,
      author: author,
      createdAt: now,
      updatedAt: now,
    };

    return this.mergeWithDefaults(defaults, overrides);
  }

  /**
   * Creates an assignment with specific book and author IDs
   */
  createWithIds(
    bookId: string,
    authorId: string,
    overrides?: DeepPartial<BookAuthorAssignment>,
  ): BookAuthorAssignment {
    return this.create({
      bookId,
      authorId,
      book: this.bookFactory.create({ id: bookId }),
      author: this.authorFactory.create({ id: authorId }),
      ...overrides,
    });
  }

  /**
   * Creates an assignment for a Stephen King book
   */
  createStephenKingAssignment(overrides?: DeepPartial<BookAuthorAssignment>): BookAuthorAssignment {
    const author = this.authorFactory.createStephenKing();
    const book = this.bookFactory.create({ title: 'The Shining' });

    return this.create({
      bookId: book.id,
      authorId: author.id,
      book: book,
      author: author,
      ...overrides,
    });
  }

  /**
   * Creates an assignment for a J.K. Rowling book
   */
  createJKRowlingAssignment(overrides?: DeepPartial<BookAuthorAssignment>): BookAuthorAssignment {
    const author = this.authorFactory.createJKRowling();
    const book = this.bookFactory.create({ title: "Harry Potter and the Philosopher's Stone" });

    return this.create({
      bookId: book.id,
      authorId: author.id,
      book: book,
      author: author,
      ...overrides,
    });
  }

  /**
   * Creates multiple assignments for the same book (co-authored)
   */
  createCoAuthoredBook(
    bookId: string,
    authorIds: string[],
    overrides?: DeepPartial<BookAuthorAssignment>,
  ): BookAuthorAssignment[] {
    const book = this.bookFactory.create({ id: bookId });

    return authorIds.map((authorId) =>
      this.create({
        bookId,
        authorId,
        book: book,
        author: this.authorFactory.create({ id: authorId }),
        ...overrides,
      }),
    );
  }

  /**
   * Creates multiple assignments for the same author (multiple books)
   */
  createMultipleBooksByAuthor(
    authorId: string,
    bookIds: string[],
    overrides?: DeepPartial<BookAuthorAssignment>,
  ): BookAuthorAssignment[] {
    const author = this.authorFactory.create({ id: authorId });

    return bookIds.map((bookId) =>
      this.create({
        bookId,
        authorId,
        book: this.bookFactory.create({ id: bookId }),
        author: author,
        ...overrides,
      }),
    );
  }
}
