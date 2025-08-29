import { Injectable, Inject } from '@nestjs/common';
import { IBookCatalogSearchService } from '../interfaces/book-catalog-search.service.interface';
import { IBookCatalogSearchRepository } from '../interfaces/book-catalog-search.repository.interface';
import { BookCatalog } from '../entities/book-catalog.entity';
import { BookFiltersDto } from '../dto/book-filters.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class BookCatalogSearchService implements IBookCatalogSearchService {
  constructor(
    @Inject('IBookCatalogSearchRepository')
    private readonly bookCatalogSearchRepository: IBookCatalogSearchRepository,
  ) {}

  async search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    return await this.bookCatalogSearchRepository.searchBooks(searchTerm, pagination);
  }

  async findWithFilters(filters: BookFiltersDto, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    return await this.bookCatalogSearchRepository.findBooksWithFilters(filters, pagination);
  }

  async findByGenre(genreId: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    return await this.bookCatalogSearchRepository.getBooksByGenre(genreId, pagination);
  }

  async findByPublisher(publisherId: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    return await this.bookCatalogSearchRepository.getBooksByPublisher(publisherId, pagination);
  }

  async findAvailableBooks(pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    return await this.bookCatalogSearchRepository.getAvailableBooks(pagination);
  }

  async checkIsbnExists(isbn: string): Promise<{ exists: boolean }> {
    const exists = await this.bookCatalogSearchRepository.checkIsbnExists(isbn);
    return { exists };
  }
}
