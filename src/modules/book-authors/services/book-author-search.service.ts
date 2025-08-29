import { Injectable, Inject } from "@nestjs/common";
import { IBookAuthorSearchRepository } from "../interfaces/book-author-search.repository.interface";
import { IBookAuthorSearchService } from "../interfaces/book-author-search.service.interface";
import { IErrorHandlerService } from "../interfaces/error-handler.service.interface";
import { BookAuthor } from "../entities/book-author.entity";
import { PaginationDto, PaginatedResult } from "../../../common/dto/pagination.dto";
import { ERROR_MESSAGES } from "../../../common/constants/error-messages";

@Injectable()
export class BookAuthorSearchService implements IBookAuthorSearchService {
  constructor(
    @Inject("IBookAuthorSearchRepository")
    private readonly searchRepository: IBookAuthorSearchRepository,
    @Inject("IErrorHandlerService")
    private readonly errorHandler: IErrorHandlerService,
  ) {}

  async search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>> {
    try {
      return await this.searchRepository.searchByTerm(searchTerm, pagination);
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.FAILED_TO_GET_ALL);
    }
  }

  async findByFullName(firstName: string, lastName: string): Promise<BookAuthor> {
    try {
      const author = await this.searchRepository.findByFullName(firstName, lastName);
      if (!author) {
        this.errorHandler.createNotFoundException(ERROR_MESSAGES.BOOK_AUTHORS.NOT_FOUND);
      }
      return author;
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.NOT_FOUND);
    }
  }
}