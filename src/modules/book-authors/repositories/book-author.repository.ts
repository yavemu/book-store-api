import { Injectable, NotFoundException, ConflictException, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindManyOptions, ILike } from "typeorm";
import { BookAuthor } from "../entities/book-author.entity";
import { IBookAuthorRepository } from "../interfaces/book-author.repository.interface";
import { CreateBookAuthorDto } from "../dto/create-book-author.dto";
import { UpdateBookAuthorDto } from "../dto/update-book-author.dto";
import { PaginationDto, PaginatedResult } from "../../../common/dto/pagination.dto";
import { BaseRepository } from "../../../common/repositories/base.repository";
import { SuccessResponseDto } from "../../../common/dto/success-response.dto";
import { SUCCESS_MESSAGES } from "../../../common/exceptions/success-messages";

@Injectable()
export class BookAuthorRepository extends BaseRepository<BookAuthor> implements IBookAuthorRepository {
  constructor(
    @InjectRepository(BookAuthor)
    private readonly authorRepository: Repository<BookAuthor>,
  ) {
    super(authorRepository);
  }

  // Public business logic methods

  async registerAuthor(
    createBookAuthorDto: CreateBookAuthorDto,
  ): Promise<SuccessResponseDto<BookAuthor>> {
    try {
      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(createBookAuthorDto, undefined, [
        {
          field: ['firstName', 'lastName'],
          message: 'Author with this full name already exists',
          transform: (value: string) => value.trim(),
        },
      ]);

      // Use inherited method from BaseRepository
      const entityData = {
        ...createBookAuthorDto,
        birthDate: new Date(createBookAuthorDto.birthDate),
      };
      return await this._createEntity(
        entityData,
        SUCCESS_MESSAGES.BOOK_AUTHORS.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to register author',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAuthorProfile(
    authorId: string,
  ): Promise<SuccessResponseDto<BookAuthor>> {
    try {
      const author = await this._findById(authorId);
      if (!author) {
        throw new NotFoundException('Author not found');
      }
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.BOOK_AUTHORS.FOUND_ONE,
        author,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get author profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAuthorProfile(
    authorId: string,
    updateBookAuthorDto: UpdateBookAuthorDto,
  ): Promise<SuccessResponseDto<BookAuthor>> {
    try {
      const authorResponse = await this.getAuthorProfile(authorId);
      const author = authorResponse.data;

      // Create combined DTO with existing values for validation
      const validationDto = {
        firstName: updateBookAuthorDto.firstName || author.firstName,
        lastName: updateBookAuthorDto.lastName || author.lastName,
      };

      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(validationDto, authorId, [
        {
          field: ['firstName', 'lastName'],
          message: 'Author with this full name already exists',
          transform: (value: string) => value.trim(),
        },
      ]);

      // Use inherited method from BaseRepository
      const entityData = {
        ...updateBookAuthorDto,
        ...(updateBookAuthorDto.birthDate && {
          birthDate: new Date(updateBookAuthorDto.birthDate),
        }),
      };
      return await this._updateEntity(
        authorId,
        entityData,
        SUCCESS_MESSAGES.BOOK_AUTHORS.UPDATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update author profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deactivateAuthor(
    authorId: string,
  ): Promise<SuccessResponseDto<{ id: string }>> {
    try {
      await this.getAuthorProfile(authorId); // Verify author exists
      // Use inherited method from BaseRepository
      return await this._softDelete(
        authorId,
        SUCCESS_MESSAGES.BOOK_AUTHORS.DELETED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to deactivate author',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchAuthors(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookAuthor>>> {
    try {
      const options: FindManyOptions<BookAuthor> = {
        where: [
          { firstName: ILike(`%${searchTerm}%`) },
          { lastName: ILike(`%${searchTerm}%`) },
          { nationality: ILike(`%${searchTerm}%`) },
        ],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      const paginatedResult = await this._findManyWithPagination(
        options,
        pagination,
      );
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.BOOK_AUTHORS.FOUND_ALL,
        paginatedResult,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to search authors',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllAuthors(
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookAuthor>>> {
    try {
      const options: FindManyOptions<BookAuthor> = {
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      const paginatedResult = await this._findManyWithPagination(
        options,
        pagination,
      );
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.BOOK_AUTHORS.FOUND_ALL,
        paginatedResult,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to get all authors',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAuthorsByNationality(
    nationality: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookAuthor>>> {
    try {
      const options: FindManyOptions<BookAuthor> = {
        where: { nationality },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      const paginatedResult = await this._findManyWithPagination(
        options,
        pagination,
      );
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.BOOK_AUTHORS.FOUND_ALL,
        paginatedResult,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to get authors by nationality',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkAuthorFullNameExists(firstName: string, lastName: string): Promise<boolean> {
    try {
      return await this._exists({
        where: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        },
      });
    } catch (error) {
      throw new HttpException('Failed to check author full name existence', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateUniqueAuthorName(firstName: string, lastName: string): Promise<BookAuthor> {
    try {
      const author = await this._findOne({
        where: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        },
      });
      if (!author) {
        throw new NotFoundException('Author not found');
      }
      return author;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to validate author name', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}