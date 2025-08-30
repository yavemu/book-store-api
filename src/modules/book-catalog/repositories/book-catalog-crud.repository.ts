import { Injectable, NotFoundException, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, DataSource } from 'typeorm';
import { BookCatalog } from '../entities/book-catalog.entity';
import { IBookCatalogCrudRepository } from '../interfaces/book-catalog-crud.repository.interface';
import { IBookCatalogValidationRepository } from '../interfaces/book-catalog-validation.repository.interface';
import { CreateBookCatalogDto } from '../dto/create-book-catalog.dto';
import { UpdateBookCatalogDto } from '../dto/update-book-catalog.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { IAuditLoggerService } from '../../../modules/audit/interfaces/audit-logger.service.interface';
import { IInventoryMovementTrackerService } from '../../inventory-movements/interfaces/inventory-movement-tracker.service.interface';

@Injectable()
export class BookCatalogCrudRepository
  extends BaseRepository<BookCatalog>
  implements IBookCatalogCrudRepository, IBookCatalogValidationRepository
{
  constructor(
    @InjectRepository(BookCatalog)
    private readonly bookRepository: Repository<BookCatalog>,
    @Inject('IAuditLoggerService')
    protected readonly auditLogService: IAuditLoggerService,
    @Inject('IInventoryMovementTrackerService')
    private readonly inventoryMovementTrackerService: IInventoryMovementTrackerService,
    private readonly dataSource: DataSource,
  ) {
    super(bookRepository, auditLogService);
  }

  async registerBook(
    createBookCatalogDto: CreateBookCatalogDto,
    performedBy: string,
    userFullName: string = 'Unknown User',
    userRole: string = 'USER',
  ): Promise<BookCatalog> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let orderId: string;

    try {
      // Validar restricciones únicas
      await this._validateUniqueConstraints(createBookCatalogDto, undefined, [
        {
          field: 'isbnCode',
          message: 'El código ISBN ya existe',
          transform: (value: string) => value.trim(),
        },
      ]);

      const entityData = {
        ...createBookCatalogDto,
        publicationDate: new Date(createBookCatalogDto.publicationDate),
      };

      // Crear orden PENDING antes de crear el libro
      const movementType = this.inventoryMovementTrackerService.determineMovementType(true, false);
      orderId = await this.inventoryMovementTrackerService.createPendingMovement(
        {
          entityType: 'book',
          entityId: 'pending', // Se actualizará después
          userId: performedBy,
          userFullName,
          userRole,
          quantityBefore: 0,
          quantityAfter: createBookCatalogDto.stockQuantity,
          priceBefore: 0,
          priceAfter: createBookCatalogDto.price,
          movementType,
          notes: `Nuevo libro creado: ${createBookCatalogDto.title}`,
        },
        queryRunner,
      );

      // Crear el libro
      const book = queryRunner.manager.create(BookCatalog, entityData);
      const savedBook = await queryRunner.manager.save(BookCatalog, book);

      // Actualizar la orden con el ID del libro creado
      await queryRunner.manager.update(
        'orders',
        { id: orderId },
        {
          entityId: savedBook.id,
          updatedAt: new Date(),
        },
      );

      // Registrar auditoría
      await this.auditLogService.log(
        performedBy,
        savedBook.id,
        'CREATE' as any,
        `Book registered: ${savedBook.title} (ISBN: ${savedBook.isbnCode})`,
        'BookCatalog',
      );

      // Marcar orden como completada
      await this.inventoryMovementTrackerService.markMovementCompleted(orderId, queryRunner);

      await queryRunner.commitTransaction();
      return savedBook;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // Marcar orden como error si existe
      if (orderId) {
        try {
          await this.inventoryMovementTrackerService.markMovementError(
            orderId,
            queryRunner,
            error.message,
          );
        } catch (orderError) {
          // Log pero no fallar por error en orden
          console.error('Error marking order as failed:', orderError);
        }
      }

      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error al registrar el libro', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async getBookProfile(bookId: string): Promise<BookCatalog> {
    try {
      const book = await this._findOne({
        where: { id: bookId },
        relations: ['genre', 'publisher'],
      });
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      return book;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to get book profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateBookProfile(
    bookId: string,
    updateBookCatalogDto: UpdateBookCatalogDto,
    performedBy: string,
    userFullName: string = 'Unknown User',
    userRole: string = 'USER',
  ): Promise<BookCatalog> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let orderId: string;

    try {
      // Obtener el libro actual para comparar cambios
      const currentBook = await this.getBookProfile(bookId);

      // Validar si hay cambios significativos (precio o cantidad)
      const hasSignificantChanges =
        (updateBookCatalogDto.price !== undefined &&
          updateBookCatalogDto.price !== currentBook.price) ||
        (updateBookCatalogDto.stockQuantity !== undefined &&
          updateBookCatalogDto.stockQuantity !== currentBook.stockQuantity);

      if (!hasSignificantChanges) {
        // Solo actualización normal sin orden
        await this._validateUniqueConstraints(updateBookCatalogDto, bookId, [
          {
            field: 'isbnCode',
            message: 'El código ISBN ya existe',
            transform: (value: string) => value.trim(),
          },
        ]);

        const entityData = {
          ...updateBookCatalogDto,
          ...(updateBookCatalogDto.publicationDate && {
            publicationDate: new Date(updateBookCatalogDto.publicationDate),
          }),
        };

        const result = await this._update(
          bookId,
          entityData,
          performedBy,
          'BookCatalog',
          (book) => `Book ${book.id} updated.`,
        );

        await queryRunner.commitTransaction();
        return result;
      }

      // Hay cambios significativos, crear orden
      await this._validateUniqueConstraints(updateBookCatalogDto, bookId, [
        {
          field: 'isbnCode',
          message: 'El código ISBN ya existe',
          transform: (value: string) => value.trim(),
        },
      ]);

      // Determinar el tipo de orden basado en los cambios
      const movementType = this.inventoryMovementTrackerService.determineMovementType(
        false,
        false,
        currentBook.price,
        updateBookCatalogDto.price !== undefined ? updateBookCatalogDto.price : currentBook.price,
        currentBook.stockQuantity,
        updateBookCatalogDto.stockQuantity !== undefined
          ? updateBookCatalogDto.stockQuantity
          : currentBook.stockQuantity,
      );

      // Crear orden PENDING antes de actualizar
      orderId = await this.inventoryMovementTrackerService.createPendingMovement(
        {
          entityType: 'book',
          entityId: bookId,
          userId: performedBy,
          userFullName,
          userRole,
          priceBefore: currentBook.price,
          priceAfter:
            updateBookCatalogDto.price !== undefined
              ? updateBookCatalogDto.price
              : currentBook.price,
          quantityBefore: currentBook.stockQuantity,
          quantityAfter:
            updateBookCatalogDto.stockQuantity !== undefined
              ? updateBookCatalogDto.stockQuantity
              : currentBook.stockQuantity,
          movementType,
          notes: `Actualización de libro: ${currentBook.title}`,
        },
        queryRunner,
      );

      // Actualizar el libro
      const entityData = {
        ...updateBookCatalogDto,
        ...(updateBookCatalogDto.publicationDate && {
          publicationDate: new Date(updateBookCatalogDto.publicationDate),
        }),
      };

      await queryRunner.manager.update(BookCatalog, { id: bookId }, entityData);
      const updatedBook = await queryRunner.manager.findOne(BookCatalog, {
        where: { id: bookId },
        relations: ['genre', 'publisher'],
      });

      // Registrar auditoría
      await this.auditLogService.log(
        performedBy,
        bookId,
        'UPDATE' as any,
        `Book ${bookId} updated.`,
        'BookCatalog',
      );

      // Determinar el tipo final de orden (puede cambiar si la cantidad queda en 0)
      const finalMovementType =
        updatedBook.stockQuantity === 0
          ? this.inventoryMovementTrackerService.determineMovementType(false, false)
          : movementType;

      // Marcar orden como completada
      await this.inventoryMovementTrackerService.markMovementCompleted(orderId, queryRunner, {
        movementType: finalMovementType,
        priceAfter: updatedBook.price,
        quantityAfter: updatedBook.stockQuantity,
      });

      await queryRunner.commitTransaction();
      return updatedBook;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // Marcar orden como error si existe
      if (orderId) {
        try {
          await this.inventoryMovementTrackerService.markMovementError(
            orderId,
            queryRunner,
            error.message,
          );
        } catch (orderError) {
          console.error('Error marking order as failed:', orderError);
        }
      }

      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al actualizar el perfil del libro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deactivateBook(
    bookId: string,
    performedBy: string,
    userFullName: string = 'Unknown User',
    userRole: string = 'USER',
  ): Promise<{ id: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let orderId: string;

    try {
      const book = await this.getBookProfile(bookId);

      // Crear orden ARCHIVED antes de desactivar
      orderId = await this.inventoryMovementTrackerService.createPendingMovement(
        {
          entityType: 'book',
          entityId: bookId,
          userId: performedBy,
          userFullName,
          userRole,
          priceBefore: book.price,
          priceAfter: book.price,
          quantityBefore: book.stockQuantity,
          quantityAfter: 0, // Se archiva
          movementType: this.inventoryMovementTrackerService.determineMovementType(false, true),
          notes: `Libro archivado: ${book.title}`,
        },
        queryRunner,
      );

      // Desactivar el libro (soft delete)
      await queryRunner.manager.softDelete(BookCatalog, { id: bookId });

      // Registrar auditoría
      await this.auditLogService.log(
        performedBy,
        bookId,
        'DELETE' as any,
        `Book ${bookId} deactivated.`,
        'BookCatalog',
      );

      // Marcar orden como completada
      await this.inventoryMovementTrackerService.markMovementCompleted(orderId, queryRunner);

      await queryRunner.commitTransaction();
      return { id: bookId };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // Marcar orden como error si existe
      if (orderId) {
        try {
          await this.inventoryMovementTrackerService.markMovementError(
            orderId,
            queryRunner,
            error.message,
          );
        } catch (orderError) {
          console.error('Error marking order as failed:', orderError);
        }
      }

      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error al desactivar el libro', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async getAllBooks(pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    try {
      const options: FindManyOptions<BookCatalog> = {
        relations: ['genre', 'publisher'],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to get all books', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Validation methods
  async findByIsbn(isbn: string): Promise<BookCatalog> {
    return await this._findOne({
      where: {
        isbnCode: isbn.trim(),
      },
    });
  }

  async findByIsbnExcludingId(isbn: string, excludeId: string): Promise<BookCatalog> {
    return await this._findOne({
      where: {
        isbnCode: isbn.trim(),
        id: { not: excludeId } as any,
      },
    });
  }

  async _validateUniqueConstraints(
    dto: Partial<BookCatalog>,
    entityId?: string,
    constraints?: any[],
  ): Promise<void> {
    if (!constraints) return;

    for (const constraint of constraints) {
      const fieldValue = dto[constraint.field];
      if (!fieldValue) continue;

      const transformedValue = constraint.transform ? constraint.transform(fieldValue) : fieldValue;

      let existingEntity: BookCatalog;
      if (entityId) {
        existingEntity = await this.findByIsbnExcludingId(transformedValue, entityId);
      } else {
        existingEntity = await this.findByIsbn(transformedValue);
      }

      if (existingEntity) {
        throw new Error(constraint.message);
      }
    }
  }
}
