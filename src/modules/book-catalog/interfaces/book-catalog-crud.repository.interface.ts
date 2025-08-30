import { BookCatalog } from '../entities/book-catalog.entity';
import { CreateBookCatalogDto } from '../dto/create-book-catalog.dto';
import { UpdateBookCatalogDto } from '../dto/update-book-catalog.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookCatalogCrudRepository {
  registerBook(
    createBookCatalogDto: CreateBookCatalogDto,
    performedBy: string,
  ): Promise<BookCatalog>;
  getAllBooks(pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  getBookProfile(bookId: string): Promise<BookCatalog>;
  updateBookProfile(
    bookId: string,
    updateBookCatalogDto: UpdateBookCatalogDto,
    performedBy: string,
  ): Promise<BookCatalog>;
  deactivateBook(bookId: string, performedBy: string): Promise<{ id: string }>;
}
