import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookAuthorAssignment } from '../entities/book-author-assignment.entity';
import { IBookAuthorAssignmentCrudRepository } from '../interfaces';
import { IBaseRepository } from '../interfaces';
import { CreateBookAuthorAssignmentDto } from '../dto/create-book-author-assignment.dto';
import { UpdateBookAuthorAssignmentDto } from '../dto/update-book-author-assignment.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class BookAuthorAssignmentCrudRepository
  extends BaseRepository<BookAuthorAssignment>
  implements Omit<IBookAuthorAssignmentCrudRepository, keyof IBaseRepository<BookAuthorAssignment>>
{
  constructor(
    @InjectRepository(BookAuthorAssignment)
    private readonly assignmentRepository: Repository<BookAuthorAssignment>,
  ) {
    super(assignmentRepository);
  }

  async createAssignment(
    createBookAuthorAssignmentDto: CreateBookAuthorAssignmentDto,
    performedBy: string,
  ): Promise<BookAuthorAssignment> {
    return await this._create(
      createBookAuthorAssignmentDto,
      performedBy,
      'BookAuthorAssignment',
      (assignment) =>
        `Assignment created: Book ${assignment.bookId} - Author ${assignment.authorId}`,
    );
  }

  async getAllAssignments(
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>> {
    const findOptions = {
      relations: ['book', 'author'],
      order: { [pagination.sortBy]: pagination.sortOrder },
      skip: pagination.offset,
      take: pagination.limit,
    };

    return await this._findManyWithPagination(findOptions, pagination);
  }

  async getAssignmentProfile(assignmentId: string): Promise<BookAuthorAssignment> {
    const assignment = await this._findById(assignmentId);
    if (!assignment) {
      throw new Error(`Assignment with ID ${assignmentId} not found`);
    }
    return assignment;
  }

  async updateAssignment(
    assignmentId: string,
    updateBookAuthorAssignmentDto: UpdateBookAuthorAssignmentDto,
    performedBy?: string,
  ): Promise<BookAuthorAssignment> {
    return await this._update(
      assignmentId,
      updateBookAuthorAssignmentDto,
      performedBy || 'system',
      'BookAuthorAssignment',
      (assignment) =>
        `Assignment updated: Book ${assignment.bookId} - Author ${assignment.authorId}`,
    );
  }

  async deactivateAssignment(assignmentId: string, performedBy?: string): Promise<{ id: string }> {
    await this._softDelete(
      assignmentId,
      performedBy || 'system',
      'BookAuthorAssignment',
      (assignment) =>
        `Assignment deleted: Book ${assignment.bookId} - Author ${assignment.authorId}`,
    );
    return { id: assignmentId };
  }

  async checkAssignmentExists(
    bookId: string,
    authorId: string,
    excludeId?: string,
  ): Promise<boolean> {
    const result = await this._findByFields(
      {
        bookId,
        authorId,
      },
      {
        excludeId,
      },
    );
    return result !== null;
  }
}
