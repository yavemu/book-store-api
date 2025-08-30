import { BookAuthorAssignment } from '../entities/book-author-assignment.entity';

export interface IBookAuthorAssignmentValidationRepository {
  checkAssignmentExists(bookId: string, authorId: string): Promise<boolean>;
  findByBookAndAuthor(bookId: string, authorId: string): Promise<BookAuthorAssignment>;
  _validateUniqueConstraints(
    dto: Partial<BookAuthorAssignment>,
    entityId?: string,
    constraints?: any[],
  ): Promise<void>;
}
