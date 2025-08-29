import { BookAuthor } from '../entities/book-author.entity';
import { CreateBookAuthorDto } from '../dto/create-book-author.dto';
import { UpdateBookAuthorDto } from '../dto/update-book-author.dto';
import { PaginationDto, PaginatedResult } from "../../../common/dto/pagination.dto";

export interface IBookAuthorRepository {
  registerAuthor(createBookAuthorDto: CreateBookAuthorDto, performedBy?: string): Promise<BookAuthor>;
  getAuthorProfile(authorId: string): Promise<BookAuthor>;
  updateAuthorProfile(authorId: string, updateBookAuthorDto: UpdateBookAuthorDto, performedBy?: string): Promise<BookAuthor>;
  deactivateAuthor(authorId: string, performedBy?: string): Promise<{ id: string }>;
  searchAuthors(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>>;
  getAllAuthors(pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>>;
  getAuthorsByNationality(nationality: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>>;
  checkAuthorFullNameExists(firstName: string, lastName: string): Promise<boolean>;
  validateUniqueAuthorName(firstName: string, lastName: string): Promise<BookAuthor>;
}