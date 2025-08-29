import { Injectable, Inject } from '@nestjs/common';
import { IBookCatalogSearchService } from '../interfaces/book-catalog-search.service.interface';
import { IBookCatalogSearchRepository } from '../interfaces/book-catalog-search.repository.interface';
import { BookCatalog } from '../entities/book-catalog.entity';
import { BookFiltersDto } from '../dto/book-filters.dto';
import { CsvExportFiltersDto } from '../dto/csv-export-filters.dto';
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
      'Resumen'
    ];

    // Convert books to CSV format
    const csvRows = [
      headers.join(','), // Header row
      ...books.map(book => [
        `"${book.id}"`,
        `"${book.title?.replace(/"/g, '""') || ''}"`,
        `"${book.isbnCode || ''}"`,
        `"${book.price || 0}"`,
        `"${book.isAvailable ? 'Sí' : 'No'}"`,
        `"${book.stockQuantity || 0}"`,
        `"${book.genre?.name?.replace(/"/g, '""') || 'Sin género'}"`,
        `"${book.publisher?.name?.replace(/"/g, '""') || 'Sin editorial'}"`,
        `"${book.publicationDate ? book.publicationDate.toISOString().split('T')[0] : ''}"`,
        `"${book.pageCount || ''}"`,
        `"${book.createdAt ? book.createdAt.toISOString().split('T')[0] : ''}"`,
        `"${book.summary?.replace(/"/g, '""').replace(/\n/g, ' ') || ''}"`
      ].join(','))
    ];

    return csvRows.join('\n');
  }
}
