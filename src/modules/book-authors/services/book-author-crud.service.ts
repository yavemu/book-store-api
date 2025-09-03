import { Injectable, Inject, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { IBookAuthorCrudRepository } from '../interfaces';
import { IBookAuthorCrudService } from '../interfaces';
import { BookAuthor } from '../entities/book-author.entity';
import { PaginatedResult } from '../../../common/dto/pagination.dto';
import { BOOK_AUTHOR_ERROR_MESSAGES } from '../enums/error-messages.enum';
import {
  ICreateBookAuthorServiceParams,
  IGetAllBookAuthorsServiceParams,
  IGetBookAuthorByIdServiceParams,
  IUpdateBookAuthorServiceParams,
  IDeleteBookAuthorServiceParams,
} from '../interfaces';

@Injectable()
export class BookAuthorCrudService implements IBookAuthorCrudService {
  constructor(
    @Inject('IBookAuthorCrudRepository')
    private readonly crudRepository: IBookAuthorCrudRepository,
  ) {}

  async createAuthor(params: ICreateBookAuthorServiceParams): Promise<BookAuthor> {
    try {
      // Validar que no existe un autor con el mismo nombre
      await this.validateUniqueAuthorName(
        params.createBookAuthorDto.firstName,
        params.createBookAuthorDto.lastName,
      );

      // Validar que no existe un autor con el mismo email
      if (params.createBookAuthorDto.email) {
        await this.validateUniqueEmail(params.createBookAuthorDto.email);
      }

      return await this.crudRepository.createAuthor({
        createBookAuthorDto: params.createBookAuthorDto,
        performedBy: params.performedBy,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        BOOK_AUTHOR_ERROR_MESSAGES.FAILED_TO_CREATE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAuthorById(params: IGetBookAuthorByIdServiceParams): Promise<BookAuthor> {
    try {
      const author = await this.crudRepository.getAuthorById({
        authorId: params.id,
      });

      if (!author) {
        throw new NotFoundException(BOOK_AUTHOR_ERROR_MESSAGES.NOT_FOUND);
      }

      return author;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        BOOK_AUTHOR_ERROR_MESSAGES.FAILED_TO_GET_ONE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllAuthors(
    params: IGetAllBookAuthorsServiceParams,
  ): Promise<PaginatedResult<BookAuthor>> {
    try {
      return await this.crudRepository.getAllAuthors({
        pagination: params.pagination,
      });
    } catch (error) {
      throw new HttpException(
        BOOK_AUTHOR_ERROR_MESSAGES.FAILED_TO_GET_ALL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAuthor(params: IUpdateBookAuthorServiceParams): Promise<BookAuthor> {
    try {
      // Verificar que el autor existe
      const existingAuthor = await this.getAuthorById({ id: params.id });

      // Validar nombre único si se está cambiando
      if (params.updateBookAuthorDto.firstName || params.updateBookAuthorDto.lastName) {
        const firstName = params.updateBookAuthorDto.firstName || existingAuthor.firstName;
        const lastName = params.updateBookAuthorDto.lastName || existingAuthor.lastName;

        await this.validateUniqueAuthorName(firstName, lastName, params.id);
      }

      // Validar email único si se está cambiando
      if (params.updateBookAuthorDto.email) {
        await this.validateUniqueEmail(params.updateBookAuthorDto.email, params.id);
      }

      return await this.crudRepository.updateAuthor({
        authorId: params.id,
        updateBookAuthorDto: params.updateBookAuthorDto,
        performedBy: params.performedBy,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        BOOK_AUTHOR_ERROR_MESSAGES.FAILED_TO_UPDATE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteAuthor(params: IDeleteBookAuthorServiceParams): Promise<{ id: string }> {
    try {
      // Verificar que el autor existe
      await this.getAuthorById({ id: params.id });

      return await this.crudRepository.deleteAuthor({
        authorId: params.id,
        performedBy: params.performedBy,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        BOOK_AUTHOR_ERROR_MESSAGES.FAILED_TO_DELETE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Métodos privados para validación
  private async validateUniqueAuthorName(
    firstName: string,
    lastName: string,
    excludeId?: string,
  ): Promise<void> {
    const exists = await this.crudRepository.checkNameExists({
      firstName,
      lastName,
      excludeId,
    });

    if (exists) {
      throw new HttpException(BOOK_AUTHOR_ERROR_MESSAGES.NAME_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }
  }

  private async validateUniqueEmail(email: string, excludeId?: string): Promise<void> {
    const exists = await this.crudRepository.checkEmailExists({
      email,
      excludeId,
    });

    if (exists) {
      throw new HttpException(BOOK_AUTHOR_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }
  }

  // Controller compatibility methods
  async create(createDto: any, userId: string): Promise<BookAuthor> {
    return this.createAuthor({ createBookAuthorDto: createDto, userId });
  }

  async findAll(pagination: any, userId: string): Promise<PaginatedResult<BookAuthor>> {
    return this.getAllAuthors({ pagination, userId });
  }

  async findById(id: string, userId: string): Promise<BookAuthor> {
    return this.getAuthorById({ id, userId });
  }

  async update(id: string, updateDto: any, userId: string): Promise<BookAuthor> {
    return this.updateAuthor({ id, updateBookAuthorDto: updateDto, userId });
  }

  async softDelete(id: string, userId: string): Promise<{ id: string }> {
    return this.deleteAuthor({ id, userId });
  }
}
