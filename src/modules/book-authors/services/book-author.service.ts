import { Injectable, Inject } from '@nestjs/common';
import { IBookAuthorRepository } from '../interfaces/book-author.repository.interface';
import { IBookAuthorService } from '../interfaces/book-author.service.interface';
import { IAuditLogService } from '../../audit/interfaces';
import { BookAuthor } from '../entities/book-author.entity';
import { CreateBookAuthorDto } from '../dto/create-book-author.dto';
import { UpdateBookAuthorDto } from '../dto/update-book-author.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { AuditAction } from '../../audit/enums/audit-action.enum';

@Injectable()
export class BookAuthorService implements IBookAuthorService {
  constructor(
    @Inject('IBookAuthorRepository')
    private readonly bookAuthorRepository: IBookAuthorRepository,
    @Inject('IAuditLogService')
    private readonly auditService: IAuditLogService,
  ) {}

  async create(createBookAuthorDto: CreateBookAuthorDto, performedBy: string): Promise<BookAuthor> {
    const author = await this.bookAuthorRepository.registerAuthor(createBookAuthorDto);
    
    await this.auditService.log(
      performedBy,
      author.id,
      AuditAction.CREATE,
      `Created book author: ${author.firstName} ${author.lastName}`,
      "BookAuthor",
    );

    return author;
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>> {
    return await this.bookAuthorRepository.getAllAuthors(pagination);
  }

  async findById(id: string): Promise<BookAuthor> {
    return await this.bookAuthorRepository.getAuthorProfile(id);
  }

  async update(id: string, updateBookAuthorDto: UpdateBookAuthorDto, performedBy: string): Promise<BookAuthor> {
    const author = await this.bookAuthorRepository.updateAuthorProfile(id, updateBookAuthorDto);
    
    await this.auditService.log(
      performedBy,
      author.id,
      AuditAction.UPDATE,
      `Updated book author: ${author.firstName} ${author.lastName}`,
      "BookAuthor",
    );

    return author;
  }

  async softDelete(id: string, performedBy: string): Promise<void> {
    const author = await this.bookAuthorRepository.getAuthorProfile(id);
    await this.bookAuthorRepository.deactivateAuthor(id);
    
    await this.auditService.log(performedBy, id, AuditAction.DELETE, `Deleted book author: ${author.firstName} ${author.lastName}`, "BookAuthor");
  }

  async search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>> {
    return await this.bookAuthorRepository.searchAuthors(searchTerm, pagination);
  }

  async findByFullName(firstName: string, lastName: string): Promise<BookAuthor> {
    return await this.bookAuthorRepository.validateUniqueAuthorName(firstName, lastName);
  }
}