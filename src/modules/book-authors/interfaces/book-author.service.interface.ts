import { BookAuthor } from '../entities/book-author.entity';
import { CreateBookAuthorDto } from '../dto/create-book-author.dto';
import { UpdateBookAuthorDto } from '../dto/update-book-author.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookAuthorService {
  create(createBookAuthorDto: CreateBookAuthorDto, performedBy: string): Promise<BookAuthor>;
  findAll(pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>>;
  findById(id: string): Promise<BookAuthor>;
  update(id: string, updateBookAuthorDto: UpdateBookAuthorDto, performedBy: string): Promise<BookAuthor>;
  softDelete(id: string, performedBy: string): Promise<void>;
  search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>>;
  findByFullName(firstName: string, lastName: string): Promise<BookAuthor>;
}