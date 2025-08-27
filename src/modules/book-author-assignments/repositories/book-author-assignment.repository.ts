import { Injectable, NotFoundException, ConflictException, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindManyOptions } from "typeorm";
import { BookAuthorAssignment } from "../entities/book-author-assignment.entity";
import { IBookAuthorAssignmentRepository } from "../interfaces/book-author-assignment.repository.interface";
import { CreateBookAuthorAssignmentDto } from "../dto/create-book-author-assignment.dto";
import { UpdateBookAuthorAssignmentDto } from "../dto/update-book-author-assignment.dto";
import { PaginationDto, PaginatedResult } from "../../../common/dto/pagination.dto";
import { BaseRepository } from "../../../common/repositories/base.repository";

@Injectable()
export class BookAuthorAssignmentRepository extends BaseRepository<BookAuthorAssignment> implements IBookAuthorAssignmentRepository {
  constructor(
    @InjectRepository(BookAuthorAssignment)
    private readonly assignmentRepository: Repository<BookAuthorAssignment>,
  ) {
    super(assignmentRepository);
  }

  // Public business logic methods

  async createAssignment(createBookAuthorAssignmentDto: CreateBookAuthorAssignmentDto): Promise<BookAuthorAssignment> {
    try {
      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(createBookAuthorAssignmentDto, undefined, [
        {
          field: ['bookId', 'authorId'],
          message: 'Book-author assignment already exists'
        }
      ]);

      // Use inherited method from BaseRepository
      return await this._createEntity(createBookAuthorAssignmentDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to create assignment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAssignmentProfile(assignmentId: string): Promise<BookAuthorAssignment> {
    try {
      const assignment = await this._findOne({
        where: { id: assignmentId },
        relations: ['book', 'author']
      });
      if (!assignment) {
        throw new NotFoundException('Assignment not found');
      }
      return assignment;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to get assignment profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateAssignment(assignmentId: string, updateBookAuthorAssignmentDto: UpdateBookAuthorAssignmentDto): Promise<BookAuthorAssignment> {
    try {
      const assignment = await this.getAssignmentProfile(assignmentId);
      
      // Create combined DTO with existing values for validation
      const validationDto = {
        bookId: updateBookAuthorAssignmentDto.bookId || assignment.bookId,
        authorId: updateBookAuthorAssignmentDto.authorId || assignment.authorId
      };
      
      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(validationDto, assignmentId, [
        {
          field: ['bookId', 'authorId'],
          message: 'Book-author assignment already exists'
        }
      ]);

      // Use inherited method from BaseRepository
      await this._updateEntity(assignmentId, updateBookAuthorAssignmentDto);
      return await this.getAssignmentProfile(assignmentId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to update assignment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deactivateAssignment(assignmentId: string): Promise<void> {
    try {
      await this.getAssignmentProfile(assignmentId); // Verify assignment exists
      // Use inherited method from BaseRepository
      await this._softDelete(assignmentId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to deactivate assignment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllAssignments(pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>> {
    try {
      const options: FindManyOptions<BookAuthorAssignment> = {
        relations: ['book', 'author'],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to get all assignments', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAssignmentsByBook(bookId: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>> {
    try {
      const options: FindManyOptions<BookAuthorAssignment> = {
        where: { bookId },
        relations: ['book', 'author'],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to get assignments by book', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAssignmentsByAuthor(authorId: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>> {
    try {
      const options: FindManyOptions<BookAuthorAssignment> = {
        where: { authorId },
        relations: ['book', 'author'],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to get assignments by author', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkAssignmentExists(bookId: string, authorId: string): Promise<boolean> {
    try {
      return await this._exists({ 
        where: { bookId, authorId } 
      });
    } catch (error) {
      throw new HttpException('Failed to check assignment existence', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}