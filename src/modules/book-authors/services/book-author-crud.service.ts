import { Injectable, Inject } from "@nestjs/common";
import { IBookAuthorCrudRepository } from "../interfaces/book-author-crud.repository.interface";
import { IBookAuthorValidationRepository } from "../interfaces/book-author-validation.repository.interface";
import { IBookAuthorCrudService } from "../interfaces/book-author-crud.service.interface";
import { IValidationService } from "../interfaces/validation.service.interface";
import { IErrorHandlerService } from "../interfaces/error-handler.service.interface";
import { BookAuthor } from "../entities/book-author.entity";
import { CreateBookAuthorDto } from "../dto/create-book-author.dto";
import { UpdateBookAuthorDto } from "../dto/update-book-author.dto";
import { PaginationDto, PaginatedResult } from "../../../common/dto/pagination.dto";
import { ERROR_MESSAGES } from "../../../common/constants/error-messages";

@Injectable()
export class BookAuthorCrudService implements IBookAuthorCrudService {
  constructor(
    @Inject("IBookAuthorCrudRepository")
    private readonly crudRepository: IBookAuthorCrudRepository,
    @Inject("IBookAuthorValidationRepository")
    private readonly validationRepository: IBookAuthorValidationRepository,
    @Inject("IValidationService")
    private readonly validationService: IValidationService,
    @Inject("IErrorHandlerService")
    private readonly errorHandler: IErrorHandlerService,
  ) {}

  async create(createBookAuthorDto: CreateBookAuthorDto, performedBy: string): Promise<BookAuthor> {
    try {
      const uniqueConstraints = [
        {
          field: ["firstName", "lastName"] as string[],
          message: ERROR_MESSAGES.BOOK_AUTHORS.ALREADY_EXISTS,
          transform: (value: string) => value.trim(),
        },
      ];

      await this.validationService.validateUniqueConstraints(
        createBookAuthorDto,
        undefined,
        uniqueConstraints,
        this.validationRepository
      );

      return await this.crudRepository.create(createBookAuthorDto, performedBy);
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.FAILED_TO_CREATE);
    }
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>> {
    try {
      return await this.crudRepository.findAll(pagination);
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.FAILED_TO_GET_ALL);
    }
  }

  async findById(id: string): Promise<BookAuthor> {
    try {
      const author = await this.crudRepository.findById(id);
      if (!author) {
        this.errorHandler.createNotFoundException(ERROR_MESSAGES.BOOK_AUTHORS.NOT_FOUND);
      }
      return author;
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.NOT_FOUND);
    }
  }

  async update(id: string, updateBookAuthorDto: UpdateBookAuthorDto, performedBy: string): Promise<BookAuthor> {
    try {
      const existingAuthor = await this.crudRepository.findById(id);
      if (!existingAuthor) {
        this.errorHandler.createNotFoundException(ERROR_MESSAGES.BOOK_AUTHORS.NOT_FOUND);
      }

      const validationDto = {
        firstName: updateBookAuthorDto.firstName || existingAuthor.firstName,
        lastName: updateBookAuthorDto.lastName || existingAuthor.lastName,
      };

      const uniqueConstraints = [
        {
          field: ["firstName", "lastName"] as string[],
          message: ERROR_MESSAGES.BOOK_AUTHORS.ALREADY_EXISTS,
          transform: (value: string) => value.trim(),
        },
      ];

      await this.validationService.validateUniqueConstraints(
        validationDto,
        id,
        uniqueConstraints,
        this.validationRepository
      );

      return await this.crudRepository.update(id, updateBookAuthorDto, performedBy);
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.FAILED_TO_UPDATE);
    }
  }

  async softDelete(id: string, performedBy: string): Promise<void> {
    try {
      await this.crudRepository.softDelete(id, performedBy);
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.FAILED_TO_DELETE);
    }
  }
}