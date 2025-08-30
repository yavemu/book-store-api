import { BookAuthor } from '../entities/book-author.entity';
import { CreateBookAuthorDto } from '../dto/create-book-author.dto';
import { UpdateBookAuthorDto } from '../dto/update-book-author.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookAuthorCrudRepository {
  create(createBookAuthorDto: CreateBookAuthorDto, performedBy: string): Promise<BookAuthor>;
  findById(authorId: string): Promise<BookAuthor | null>;
  findAll(pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>>;
  update(
    authorId: string,
    updateBookAuthorDto: UpdateBookAuthorDto,
    performedBy: string,
  ): Promise<BookAuthor>;
  softDelete(authorId: string, performedBy: string): Promise<{ id: string }>;
}
