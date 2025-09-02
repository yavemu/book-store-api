import { BookCatalog } from '../entities/book-catalog.entity';
import { CreateBookCatalogDto } from '../dto/create-book-catalog.dto';
import { UpdateBookCatalogDto } from '../dto/update-book-catalog.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookCatalogCrudService {
  create(createBookCatalogDto: CreateBookCatalogDto, req: any): Promise<BookCatalog>;
  findAll(pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  findById(id: string): Promise<BookCatalog>;
  update(
    id: string,
    updateBookCatalogDto: UpdateBookCatalogDto,
    performedBy: string,
  ): Promise<BookCatalog>;
  softDelete(id: string, performedBy: string): Promise<void>;
}
