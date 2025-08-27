import { Injectable, Inject } from '@nestjs/common';
import { IBookAuthorAssignmentRepository } from '../interfaces/book-author-assignment.repository.interface';
import { IBookAuthorAssignmentService } from '../interfaces/book-author-assignment.service.interface';
import { IAuditLogService } from '../../audit/interfaces';
import { BookAuthorAssignment } from '../entities/book-author-assignment.entity';
import { CreateBookAuthorAssignmentDto } from '../dto/create-book-author-assignment.dto';
import { UpdateBookAuthorAssignmentDto } from '../dto/update-book-author-assignment.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { AuditAction } from '../../audit/enums/audit-action.enum';

@Injectable()
export class BookAuthorAssignmentService implements IBookAuthorAssignmentService {
  constructor(
    @Inject('IBookAuthorAssignmentRepository')
    private readonly bookAuthorAssignmentRepository: IBookAuthorAssignmentRepository,
    @Inject('IAuditLogService')
    private readonly auditService: IAuditLogService,
  ) {}

  async create(createBookAuthorAssignmentDto: CreateBookAuthorAssignmentDto, performedBy: string): Promise<BookAuthorAssignment> {
    const assignment = await this.bookAuthorAssignmentRepository.createAssignment(createBookAuthorAssignmentDto);
    
    await this.auditService.log(
      performedBy,
      assignment.id,
      AuditAction.CREATE,
      `Created book-author assignment for book ${assignment.bookId} and author ${assignment.authorId}`,
      'BookAuthorAssignment'
    );

    return assignment;
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>> {
    return await this.bookAuthorAssignmentRepository.getAllAssignments(pagination);
  }

  async findById(id: string): Promise<BookAuthorAssignment> {
    return await this.bookAuthorAssignmentRepository.getAssignmentProfile(id);
  }

  async update(id: string, updateBookAuthorAssignmentDto: UpdateBookAuthorAssignmentDto, performedBy: string): Promise<BookAuthorAssignment> {
    const assignment = await this.bookAuthorAssignmentRepository.updateAssignment(id, updateBookAuthorAssignmentDto);
    
    await this.auditService.log(
      performedBy,
      assignment.id,
      AuditAction.UPDATE,
      `Updated book-author assignment for book ${assignment.bookId} and author ${assignment.authorId}`,
      'BookAuthorAssignment'
    );

    return assignment;
  }

  async softDelete(id: string, performedBy: string): Promise<void> {
    const assignment = await this.bookAuthorAssignmentRepository.getAssignmentProfile(id);
    await this.bookAuthorAssignmentRepository.deactivateAssignment(id);
    
    await this.auditService.log(
      performedBy,
      id,
      AuditAction.DELETE,
      `Deleted book-author assignment for book ${assignment.bookId} and author ${assignment.authorId}`,
      'BookAuthorAssignment'
    );
  }

  async findByBook(bookId: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>> {
    return await this.bookAuthorAssignmentRepository.getAssignmentsByBook(bookId, pagination);
  }

  async findByAuthor(authorId: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>> {
    return await this.bookAuthorAssignmentRepository.getAssignmentsByAuthor(authorId, pagination);
  }

  async checkAssignmentExists(bookId: string, authorId: string): Promise<boolean> {
    return await this.bookAuthorAssignmentRepository.checkAssignmentExists(bookId, authorId);
  }
}