import { BookCatalog } from '../entities/book-catalog.entity';

export interface IBookCatalogValidationRepository {
  findByIsbn(isbn: string): Promise<BookCatalog>;
  findByIsbnExcludingId(isbn: string, excludeId: string): Promise<BookCatalog>;
  _validateUniqueConstraints(
    dto: Partial<BookCatalog>,
    entityId?: string,
    constraints?: any[],
  ): Promise<void>;
}
