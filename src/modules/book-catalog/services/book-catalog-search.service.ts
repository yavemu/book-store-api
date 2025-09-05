import { Injectable, Inject } from '@nestjs/common';
import { IBookCatalogSearchService } from '../interfaces/book-catalog-search.service.interface';
import { IBookCatalogSearchRepository } from '../interfaces/book-catalog-search.repository.interface';
import { BookCatalog } from '../entities/book-catalog.entity';
import { BookFiltersDto } from '../dto/book-filters.dto';
import { BookExactSearchDto } from '../dto/book-exact-search.dto';
import { BookSimpleFilterDto } from '../dto/book-simple-filter.dto';
import { CsvExportFiltersDto } from '../dto/csv-export-filters.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class BookCatalogSearchService implements IBookCatalogSearchService {
  constructor(
    @Inject('IBookCatalogSearchRepository')
    private readonly bookCatalogSearchRepository: IBookCatalogSearchRepository,
  ) {}

  async exactSearch(
    searchDto: BookExactSearchDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookCatalog>> {
    return await this.bookCatalogSearchRepository.exactSearchBooks(searchDto, pagination);
  }

  async simpleFilter(
    term: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookCatalog>> {
    return await this.bookCatalogSearchRepository.simpleFilterBooks(term, pagination);
  }

  async advancedFilter(
    filters: BookFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookCatalog>> {
    return await this.bookCatalogSearchRepository.advancedFilterBooks(filters, pagination);
  }

  async findByGenre(
    genreId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookCatalog>> {
    return await this.bookCatalogSearchRepository.getBooksByGenre(genreId, pagination);
  }

  async findByPublisher(
    publisherId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookCatalog>> {
    return await this.bookCatalogSearchRepository.getBooksByPublisher(publisherId, pagination);
  }

  async exportToCsv(filters?: CsvExportFiltersDto): Promise<string> {
    const books = await this.bookCatalogSearchRepository.getBooksForCsvExport(filters);

    // Define CSV headers
    const headers = [
      'ID',
      'Título',
      'ISBN',
      'Precio',
      'Disponible',
      'Stock',
      'Género',
      'Editorial',
      'Fecha Publicación',
      'Páginas',
      'Fecha Creación',
      'Resumen',
    ];

    // Convert books to CSV format
    const csvRows = [
      headers.join(','), // Header row
      ...books.map((book) =>
        [
          `"${book.id}"`,
          `"${book.title?.replace(/"/g, '""') || ''}"`,
          `"${book.isbnCode || ''}"`,
          `"${book.price || 0}"`,
          `"${book.isAvailable ? 'Sí' : 'No'}"`,
          `"${book.stockQuantity || 0}"`,
          `"${book.genre?.name?.replace(/"/g, '""') || 'Sin género'}"`,
          `"${book.publisher?.name?.replace(/"/g, '""') || 'Sin editorial'}"`,
          `"${book.publicationDate ? this.formatDateForCsv(book.publicationDate) : ''}"`,
          `"${book.pageCount || ''}"`,
          `"${book.createdAt ? book.createdAt.toISOString().split('T')[0] : ''}"`,
          `"${book.summary?.replace(/"/g, '""').replace(/\n/g, ' ') || ''}"`,
        ].join(','),
      ),
    ];

    return csvRows.join('\n');
  }

  /**
   * Helper method to format dates safely for CSV export
   * @private
   */
  private formatDateForCsv(date: Date | string): string {
    try {
      if (!date) return '';

      // If it's already a string in YYYY-MM-DD format, return it
      if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(date)) {
        return date.split('T')[0];
      }

      // If it's a string, try to parse it as a Date
      if (typeof date === 'string') {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString().split('T')[0];
        }
        return '';
      }

      // If it's a Date object, format it
      if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }

      return '';
    } catch (error) {
      return '';
    }
  }
}
