import { Injectable, Inject } from '@nestjs/common';
import { IBookAuthorAssignmentRepository } from '../interfaces';
import { IBookAuthorAssignmentService } from '../interfaces';
import { BookAuthorAssignment } from '../entities/book-author-assignment.entity';
import { CreateBookAuthorAssignmentDto } from '../dto/create-book-author-assignment.dto';
import { UpdateBookAuthorAssignmentDto } from '../dto/update-book-author-assignment.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class BookAuthorAssignmentService implements IBookAuthorAssignmentService {
  constructor(
    @Inject('IBookAuthorAssignmentRepository')
    private readonly bookAuthorAssignmentRepository: IBookAuthorAssignmentRepository,
  ) {}

  async create(
    createBookAuthorAssignmentDto: CreateBookAuthorAssignmentDto,
    performedBy: string,
  ): Promise<BookAuthorAssignment> {
    return await this.bookAuthorAssignmentRepository.createAssignment(
      createBookAuthorAssignmentDto,
      performedBy,
    );
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>> {
    return await this.bookAuthorAssignmentRepository.getAllAssignments(pagination);
  }

  async findById(id: string): Promise<BookAuthorAssignment> {
    return await this.bookAuthorAssignmentRepository.getAssignmentProfile(id);
  }

  async update(
    id: string,
    updateBookAuthorAssignmentDto: UpdateBookAuthorAssignmentDto,
    performedBy: string,
  ): Promise<BookAuthorAssignment> {
    return await this.bookAuthorAssignmentRepository.updateAssignment(
      id,
      updateBookAuthorAssignmentDto,
      performedBy,
    );
  }

  async softDelete(id: string, performedBy: string): Promise<void> {
    await this.bookAuthorAssignmentRepository.deactivateAssignment(id, performedBy);
  }

  async findByBook(
    bookId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>> {
    return await this.bookAuthorAssignmentRepository.getAssignmentsByBook(bookId, pagination);
  }

  async findByAuthor(
    authorId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>> {
    return await this.bookAuthorAssignmentRepository.getAssignmentsByAuthor(authorId, pagination);
  }

  async checkAssignmentExists(bookId: string, authorId: string): Promise<{ exists: boolean }> {
    const exists = await this.bookAuthorAssignmentRepository.checkAssignmentExists(
      bookId,
      authorId,
    );
    return { exists };
  }
}
