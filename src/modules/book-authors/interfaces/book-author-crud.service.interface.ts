import { BookAuthor } from '../entities/book-author.entity';
import { CreateBookAuthorDto } from '../dto/create-book-author.dto';
import { UpdateBookAuthorDto } from '../dto/update-book-author.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { ListSelectDto } from '../../../common/dto/list-select.dto';

export interface IBookAuthorCrudService {
  create(createBookAuthorDto: CreateBookAuthorDto, performedBy: string): Promise<BookAuthor>;
  findById(id: string): Promise<BookAuthor>;
  findAll(pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>>;
  update(
    id: string,
    updateBookAuthorDto: UpdateBookAuthorDto,
    performedBy: string,
  ): Promise<BookAuthor>;
  softDelete(id: string, performedBy: string): Promise<void>;
  findForSelect(): Promise<ListSelectDto[]>;
}
