import { Injectable, Inject } from '@nestjs/common';
import { IBookCatalogCrudService } from '../interfaces/book-catalog-crud.service.interface';
import { IBookCatalogCrudRepository } from '../interfaces/book-catalog-crud.repository.interface';
import { BookCatalog } from '../entities/book-catalog.entity';
import { CreateBookCatalogDto } from '../dto/create-book-catalog.dto';
import { UpdateBookCatalogDto } from '../dto/update-book-catalog.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class BookCatalogCrudService implements IBookCatalogCrudService {
  constructor(
    @Inject('IBookCatalogCrudRepository')
    private readonly bookCatalogCrudRepository: IBookCatalogCrudRepository,
  ) {}

  async create(createBookCatalogDto: CreateBookCatalogDto, performedBy: string): Promise<BookCatalog> {
    return await this.bookCatalogCrudRepository.registerBook(createBookCatalogDto, performedBy);
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    return await this.bookCatalogCrudRepository.getAllBooks(pagination);
  }

  async findById(id: string): Promise<BookCatalog> {
    return await this.bookCatalogCrudRepository.getBookProfile(id);
  }

  async update(id: string, updateBookCatalogDto: UpdateBookCatalogDto, performedBy: string): Promise<BookCatalog> {
    return await this.bookCatalogCrudRepository.updateBookProfile(id, updateBookCatalogDto, performedBy);
  }

  async softDelete(id: string, performedBy: string): Promise<void> {
    await this.bookCatalogCrudRepository.deactivateBook(id, performedBy);
  }
}
