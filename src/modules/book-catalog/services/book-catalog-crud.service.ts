import { Injectable, Inject, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { IBookCatalogCrudService } from '../interfaces';
import { IBookCatalogCrudRepository } from '../interfaces';
import {
  IInventoryMovementTrackerService,
  MovementTrackingData,
} from '../interfaces';
import { BookCatalog } from '../entities/book-catalog.entity';
import { PaginatedResult } from '../../../common/dto/pagination.dto';
import { BOOK_CATALOG_ERROR_MESSAGES } from '../enums/error-messages.enum';
import { UserRole } from '../../../common/enums/user-role.enum';
import { MovementType } from '../../inventory-movements/enums/movement-type.enum';
import {
  ICreateBookCatalogServiceParams,
  IRegisterBookCatalogServiceParams,
  IGetAllBookCatalogsServiceParams,
  IGetBookCatalogByIdServiceParams,
  IUpdateBookCatalogServiceParams,
  IDeleteBookCatalogServiceParams,
} from '../interfaces';

@Injectable()
export class BookCatalogCrudService implements IBookCatalogCrudService {
  constructor(
    @Inject('IBookCatalogCrudRepository')
    private readonly bookCatalogCrudRepository: IBookCatalogCrudRepository,
    @Inject('IInventoryMovementTrackerService')
    private readonly inventoryMovementTracker: IInventoryMovementTrackerService,
  ) {}

  async createBook(params: ICreateBookCatalogServiceParams): Promise<BookCatalog> {
    try {
      // Validar ISBN único
      await this.validateUniqueISBN(params.createBookCatalogDto.isbn);

      return await this.bookCatalogCrudRepository.createBook({
        createBookCatalogDto: params.createBookCatalogDto,
        performedBy: params.performedBy,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        BOOK_CATALOG_ERROR_MESSAGES.FAILED_TO_CREATE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async registerBook(params: IRegisterBookCatalogServiceParams): Promise<BookCatalog> {
    return await this.bookCatalogCrudRepository._withTransaction(async (queryRunner) => {
      // Validar ISBN único
      await this.validateUniqueISBN(params.createBookCatalogDto.isbn);

      // Crear el libro en la base de datos
      const book = await this.bookCatalogCrudRepository._create(
        params.createBookCatalogDto,
        params.performedBy,
        'BookCatalog',
        (book) => `Libro registrado: ${book.title} - ISBN: ${book.isbn}`,
        queryRunner,
      );

      // Crear movimiento de inventario para el nuevo libro
      const movementData: MovementTrackingData = {
        entityType: 'BookCatalog',
        entityId: book.id,
        userId: params.performedBy,
        userFullName: params.userFullName || 'Usuario Desconocido',
        userRole: params.userRole || 'user',
        quantityBefore: 0,
        quantityAfter: params.createBookCatalogDto.quantity || 0,
        priceBefore: 0,
        priceAfter: params.createBookCatalogDto.unitPrice,
        movementType: MovementType.BOOK_REGISTRATION,
        notes: `Registro inicial del libro: ${book.title}`,
      };

      const movementId = await this.inventoryMovementTracker.createPendingMovement(
        movementData,
        queryRunner,
      );

      // Marcar movimiento como completado
      await this.inventoryMovementTracker.markMovementCompleted(movementId, queryRunner);

      return book;
    });
  }

  async getAllBooks(
    params: IGetAllBookCatalogsServiceParams,
  ): Promise<PaginatedResult<BookCatalog>> {
    try {
      return await this.bookCatalogCrudRepository.getAllBooks({
        pagination: params.pagination,
      });
    } catch (error) {
      throw new HttpException(
        BOOK_CATALOG_ERROR_MESSAGES.FAILED_TO_GET_ALL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBookById(params: IGetBookCatalogByIdServiceParams): Promise<BookCatalog> {
    try {
      const book = await this.bookCatalogCrudRepository.getBookById({
        id: params.id,
      });

      if (!book) {
        throw new NotFoundException(BOOK_CATALOG_ERROR_MESSAGES.NOT_FOUND);
      }

      return book;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        BOOK_CATALOG_ERROR_MESSAGES.FAILED_TO_GET_ONE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateBook(params: IUpdateBookCatalogServiceParams): Promise<BookCatalog> {
    return await this.bookCatalogCrudRepository._withTransaction(async (queryRunner) => {
      // Verificar que el libro existe
      const existingBook = await this.getBookById({ id: params.id });

      // Validar ISBN único si se está cambiando
      if (
        params.updateBookCatalogDto.isbn &&
        params.updateBookCatalogDto.isbn !== existingBook.isbn
      ) {
        await this.validateUniqueISBN(params.updateBookCatalogDto.isbn, params.id);
      }

      // Detectar cambios para movimiento de inventario
      const hasQuantityChange =
        params.updateBookCatalogDto.quantity !== undefined &&
        params.updateBookCatalogDto.quantity !== existingBook.quantity;
      const hasPriceChange =
        params.updateBookCatalogDto.unitPrice !== undefined &&
        params.updateBookCatalogDto.unitPrice !== existingBook.unitPrice;

      let movementId: string | null = null;

      // Si hay cambios de inventario, crear movimiento pendiente
      if (hasQuantityChange || hasPriceChange) {
        const movementType = this.inventoryMovementTracker.determineMovementType(
          false, // no es creación
          false, // no es eliminación
          existingBook.unitPrice,
          params.updateBookCatalogDto.unitPrice || existingBook.unitPrice,
          existingBook.quantity,
          params.updateBookCatalogDto.quantity || existingBook.quantity,
        );

        const movementData: MovementTrackingData = {
          entityType: 'BookCatalog',
          entityId: params.id,
          userId: params.performedBy,
          userFullName: params.userFullName || 'Usuario Desconocido',
          userRole: params.userRole || 'user',
          quantityBefore: existingBook.quantity,
          quantityAfter: params.updateBookCatalogDto.quantity || existingBook.quantity,
          priceBefore: existingBook.unitPrice,
          priceAfter: params.updateBookCatalogDto.unitPrice || existingBook.unitPrice,
          movementType,
          notes: `Actualización del libro: ${existingBook.title}`,
        };

        movementId = await this.inventoryMovementTracker.createPendingMovement(
          movementData,
          queryRunner,
        );
      }

      // Actualizar el libro
      const updatedBook = await this.bookCatalogCrudRepository._update(
        params.id,
        params.updateBookCatalogDto,
        params.performedBy,
        'BookCatalog',
        (book) => `Libro actualizado: ${book.title} - ISBN: ${book.isbn}`,
        queryRunner,
      );

      // Marcar movimiento como completado si existe
      if (movementId) {
        await this.inventoryMovementTracker.markMovementCompleted(movementId, queryRunner);
      }

      return updatedBook;
    });
  }

  async deleteBook(params: IDeleteBookCatalogServiceParams): Promise<{ id: string }> {
    return await this.bookCatalogCrudRepository._withTransaction(async (queryRunner) => {
      // Verificar que el libro existe
      const existingBook = await this.getBookById({ id: params.id });

      // Crear movimiento de inventario para eliminación
      const movementData: MovementTrackingData = {
        entityType: 'BookCatalog',
        entityId: params.id,
        userId: params.performedBy,
        userFullName: params.userFullName || 'Usuario Desconocido',
        userRole: params.userRole || 'user',
        quantityBefore: existingBook.quantity,
        quantityAfter: 0,
        priceBefore: existingBook.unitPrice,
        priceAfter: 0,
        movementType: MovementType.BOOK_DEACTIVATION,
        notes: `Desactivación del libro: ${existingBook.title}`,
      };

      const movementId = await this.inventoryMovementTracker.createPendingMovement(
        movementData,
        queryRunner,
      );

      // Realizar soft delete del libro
      const result = await this.bookCatalogCrudRepository._softDelete(
        params.id,
        params.performedBy,
        'BookCatalog',
        (book) => `Libro desactivado: ${book.title} - ISBN: ${book.isbn}`,
        queryRunner,
      );

      // Marcar movimiento como completado
      await this.inventoryMovementTracker.markMovementCompleted(movementId, queryRunner);

      return result;
    });
  }

  // Métodos privados para validación
  private async validateUniqueISBN(isbn: string, excludeId?: string): Promise<void> {
    const exists = await this.bookCatalogCrudRepository.checkISBNExists({
      isbn,
      excludeId,
    });

    if (exists) {
      throw new HttpException(BOOK_CATALOG_ERROR_MESSAGES.ISBN_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }
  }
}
