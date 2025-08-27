import { Injectable, NotFoundException, ConflictException, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindManyOptions, ILike } from "typeorm";
import { BookAuthor } from "../entities/book-author.entity";
import { IBookAuthorRepository } from "../interfaces/book-author.repository.interface";
import { CreateBookAuthorDto } from "../dto/create-book-author.dto";
import { UpdateBookAuthorDto } from "../dto/update-book-author.dto";
import { PaginationDto, PaginatedResult } from "../../../common/dto/pagination.dto";
import { BaseRepository } from "../../../common/repositories/base.repository";

@Injectable()
export class BookAuthorRepository extends BaseRepository<BookAuthor> implements IBookAuthorRepository {
  constructor(
    @InjectRepository(BookAuthor)
    private readonly authorRepository: Repository<BookAuthor>,
  ) {
    super(authorRepository);
  }

  // Public business logic methods

  async registerAuthor(createBookAuthorDto: CreateBookAuthorDto): Promise<BookAuthor> {
    try {
      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(createBookAuthorDto, undefined, [
        {
          field: ['authorFirstName', 'authorLastName'],
          message: 'Author with this full name already exists',
          transform: (value: string) => value.trim()
        }
      ]);

      // Use inherited method from BaseRepository
      return await this._createEntity(createBookAuthorDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to register author', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAuthorProfile(authorId: string): Promise<BookAuthor> {
    try {
      const author = await this._findById(authorId);
      if (!author) {
        throw new NotFoundException('Author not found');
      }
      return author;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to get author profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateAuthorProfile(authorId: string, updateBookAuthorDto: UpdateBookAuthorDto): Promise<BookAuthor> {
    try {
      const author = await this.getAuthorProfile(authorId);
      
      // Create combined DTO with existing values for validation
      const validationDto = {
        authorFirstName: updateBookAuthorDto.authorFirstName || author.authorFirstName,
        authorLastName: updateBookAuthorDto.authorLastName || author.authorLastName
      };
      
      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(validationDto, authorId, [
        {
          field: ['authorFirstName', 'authorLastName'],
          message: 'Author with this full name already exists',
          transform: (value: string) => value.trim()
        }
      ]);

      // Use inherited method from BaseRepository
      await this._updateEntity(authorId, updateBookAuthorDto);
      return await this._findById(authorId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to update author profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deactivateAuthor(authorId: string): Promise<void> {
    try {
      await this.getAuthorProfile(authorId); // Verify author exists
      // Use inherited method from BaseRepository
      await this._softDelete(authorId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to deactivate author', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async searchAuthors(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>> {
    try {
      const options: FindManyOptions<BookAuthor> = {
        where: [
          { authorFirstName: ILike(`%${searchTerm}%`) },
          { authorLastName: ILike(`%${searchTerm}%`) },
          { nationality: ILike(`%${searchTerm}%`) },
        ],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to search authors', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllAuthors(pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>> {
    try {
      const options: FindManyOptions<BookAuthor> = {
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to get all authors', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAuthorsByNationality(nationality: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>> {
    try {
      const options: FindManyOptions<BookAuthor> = {
        where: { nationality },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to get authors by nationality', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkAuthorFullNameExists(firstName: string, lastName: string): Promise<boolean> {
    try {
      return await this._exists({ 
        where: { 
          authorFirstName: firstName.trim(), 
          authorLastName: lastName.trim() 
        } 
      });
    } catch (error) {
      throw new HttpException('Failed to check author full name existence', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateUniqueAuthorName(firstName: string, lastName: string): Promise<BookAuthor> {
    try {
      const author = await this._findOne({ 
        where: { 
          authorFirstName: firstName.trim(), 
          authorLastName: lastName.trim() 
        } 
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