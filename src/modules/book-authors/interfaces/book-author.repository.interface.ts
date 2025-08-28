import { BookAuthor } from '../entities/book-author.entity';
import { CreateBookAuthorDto } from '../dto/create-book-author.dto';
import { UpdateBookAuthorDto } from '../dto/update-book-author.dto';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';
import { SuccessResponseDto } from '../../../common/dto/success-response.dto';

export interface IBookAuthorRepository {
  registerAuthor(
    createBookAuthorDto: CreateBookAuthorDto,
    performedBy?: string,
  ): Promise<SuccessResponseDto<BookAuthor>>;
  getAuthorProfile(authorId: string): Promise<SuccessResponseDto<BookAuthor>>;
  updateAuthorProfile(
    authorId: string,
    updateBookAuthorDto: UpdateBookAuthorDto,
    performedBy?: string,
  ): Promise<SuccessResponseDto<BookAuthor>>;
  deactivateAuthor(
    authorId: string,
    performedBy?: string,
  ): Promise<SuccessResponseDto<{ id: string }>>;
  searchAuthors(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookAuthor>>>;
  getAllAuthors(
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookAuthor>>>;
  getAuthorsByNationality(
    nationality: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookAuthor>>>;
  checkAuthorFullNameExists(firstName: string, lastName: string): Promise<boolean>;
  validateUniqueAuthorName(firstName: string, lastName: string): Promise<BookAuthor>;
}