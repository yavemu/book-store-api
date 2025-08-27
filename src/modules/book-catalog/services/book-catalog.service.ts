import { Injectable, Inject } from '@nestjs/common';
import { IBookCatalogRepository } from '../interfaces/book-catalog.repository.interface';
import { IBookCatalogService } from '../interfaces/book-catalog.service.interface';
import { IAuditLogService } from '../../audit/interfaces';
import { BookCatalog } from '../entities/book-catalog.entity';
import { CreateBookCatalogDto } from '../dto/create-book-catalog.dto';
import { UpdateBookCatalogDto } from '../dto/update-book-catalog.dto';
import { BookFiltersDto } from '../dto/book-filters.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { AuditAction } from '../../audit/enums/audit-action.enum';

@Injectable()
export class BookCatalogService implements IBookCatalogService {
  constructor(
    @Inject('IBookCatalogRepository')
    private readonly bookCatalogRepository: IBookCatalogRepository,
    @Inject('IAuditLogService')
    private readonly auditService: IAuditLogService,
  ) {}

  async create(createBookCatalogDto: CreateBookCatalogDto, performedBy: string): Promise<BookCatalog> {
    const book = await this.bookCatalogRepository.registerBook(createBookCatalogDto);
    
    await this.auditService.log(
      performedBy,
      book.id,
      AuditAction.CREATE,
      `Created book: ${book.bookTitle}`,
      'BookCatalog'
    );

    return book;
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    return await this.bookCatalogRepository.getAllBooks(pagination);
  }

  async findById(id: string): Promise<BookCatalog> {
    return await this.bookCatalogRepository.getBookProfile(id);
  }

  async update(id: string, updateBookCatalogDto: UpdateBookCatalogDto, performedBy: string): Promise<BookCatalog> {
    const book = await this.bookCatalogRepository.updateBookProfile(id, updateBookCatalogDto);
    
    await this.auditService.log(
      performedBy,
      book.id,
      AuditAction.UPDATE,
      `Updated book: ${book.bookTitle}`,
      'BookCatalog'
    );

    return book;
  }

  async softDelete(id: string, performedBy: string): Promise<void> {
    const book = await this.bookCatalogRepository.getBookProfile(id);
    await this.bookCatalogRepository.deactivateBook(id);
    
    await this.auditService.log(
      performedBy,
      id,
      AuditAction.DELETE,
      `Deleted book: ${book.bookTitle}`,
      'BookCatalog'
    );
  }

  async search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    return await this.bookCatalogRepository.searchBooks(searchTerm, pagination);
  }

  async findWithFilters(filters: BookFiltersDto, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    return await this.bookCatalogRepository.findBooksWithFilters(filters, pagination);
  }

  async findByGenre(genreId: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    return await this.bookCatalogRepository.getBooksByGenre(genreId, pagination);
  }

  async findByPublisher(publisherId: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    return await this.bookCatalogRepository.getBooksByPublisher(publisherId, pagination);
  }

  async findAvailableBooks(pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    return await this.bookCatalogRepository.getAvailableBooks(pagination);
  }

  async checkIsbnExists(isbn: string): Promise<boolean> {
    return await this.bookCatalogRepository.checkIsbnExists(isbn);
  }
}