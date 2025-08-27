import { Injectable, Inject } from '@nestjs/common';
import { IBookAuthorRepository } from '../interfaces/book-author.repository.interface';
import { IBookAuthorService } from '../interfaces/book-author.service.interface';
import { BookAuthor } from '../entities/book-author.entity';
import { CreateBookAuthorDto } from '../dto/create-book-author.dto';
import { UpdateBookAuthorDto } from '../dto/update-book-author.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class BookAuthorService implements IBookAuthorService {
  constructor(
    @Inject('IBookAuthorRepository')
    private readonly bookAuthorRepository: IBookAuthorRepository,
  ) {}

  async create(createBookAuthorDto: CreateBookAuthorDto, performedBy: string): Promise<BookAuthor> {
    return await this.bookAuthorRepository.registerAuthor(createBookAuthorDto, performedBy);
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>> {
    return await this.bookAuthorRepository.getAllAuthors(pagination);
  }

  async findById(id: string): Promise<BookAuthor> {
    return await this.bookAuthorRepository.getAuthorProfile(id);
  }

  async update(id: string, updateBookAuthorDto: UpdateBookAuthorDto, performedBy: string): Promise<BookAuthor> {
    return await this.bookAuthorRepository.updateAuthorProfile(id, updateBookAuthorDto, performedBy);
  }

  async softDelete(id: string, performedBy: string): Promise<void> {
    await this.bookAuthorRepository.deactivateAuthor(id, performedBy);
  }

  async search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>> {
    return await this.bookAuthorRepository.searchAuthors(searchTerm, pagination);
  }

  async findByFullName(firstName: string, lastName: string): Promise<BookAuthor> {
    return await this.bookAuthorRepository.validateUniqueAuthorName(firstName, lastName);
  }
}