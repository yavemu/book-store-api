import { Injectable, NotFoundException, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, DataSource, EntityManager, Not } from 'typeorm';
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
import { UserRole } from '../../../common/enums/user-role.enum';

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
    userRole: string = UserRole.USER,
  ): Promise<BookCatalog> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let savedBook: BookCatalog;
    let movementId: string;

    try {
      console.log('🔹 [START] Registro de libro con transacción');

      // 1. Validar restricciones únicas (usar manager de la transacción)
      console.log('🔹 Validando restricciones únicas...');
      await this._validateUniqueConstraints(createBookCatalogDto, queryRunner.manager, [
        {
          field: 'isbnCode',
          message: 'El código ISBN ya existe',
          transform: (value: string) => value.trim(),
        },
      ]);
      console.log('✅ Restricciones validadas');

      // 2. Preparar datos del libro
      console.log('🔹 Preparando datos de libro...');
      const entityData = {
        ...createBookCatalogDto,
        ...(createBookCatalogDto.publicationDate && {
          publicationDate: new Date(createBookCatalogDto.publicationDate),
        }),
      };

      // 3. Crear libro
      console.log('🔹 Creando libro...');
      const book = queryRunner.manager.create(BookCatalog, entityData);
      savedBook = await queryRunner.manager.save(BookCatalog, book);
      console.log('✅ Libro creado con ID:', savedBook.id);

      // 4. Crear movimiento inventario PENDING (dentro de la transacción)
      console.log('🔹 Creando movimiento de inventario PENDING...');
      movementId = await this.inventoryMovementTrackerService.createPendingMovement(
        {
          entityType: 'BookCatalog',
          entityId: savedBook.id,
          userId: performedBy,
          userFullName,
          userRole,
          quantityBefore: 0,
          quantityAfter: savedBook.stockQuantity,
          priceBefore: 0,
          priceAfter: savedBook.price,
          movementType: this.inventoryMovementTrackerService.determineMovementType(
            true, // isCreate
            false, // isDelete
            0, // priceBefore
            savedBook.price, // priceAfter
            0, // quantityBefore
            savedBook.stockQuantity, // quantityAfter
          ),
          notes: `Book registered: ${savedBook.title} (ISBN: ${savedBook.isbnCode})`,
        },
        queryRunner, // 🔑 importante: usar mismo queryRunner
      );
      console.log('✅ Movimiento PENDING creado con ID:', movementId);

      // 5. Marcar movimiento como COMPLETED (aún dentro de la transacción)
      console.log('🔹 Marcando movimiento como COMPLETED...');
      await this.inventoryMovementTrackerService.markMovementCompleted(movementId, queryRunner);
      console.log('✅ Movimiento COMPLETED con ID:', movementId);

      // 6. Confirmar transacción
      console.log('🔹 Confirmando transacción...');
      await queryRunner.commitTransaction();
      console.log('✅ Transacción confirmada con éxito');
    } catch (error) {
      console.error('❌ Error durante la transacción:', error);

      try {
        console.log('🔹 Revirtiendo transacción...');
        await queryRunner.rollbackTransaction();
        console.log('✅ Transacción revertida');
      } catch (rollbackError) {
        console.error('❌ Error al revertir transacción:', rollbackError);
      }

      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error al registrar el libro', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      console.log('🔹 Liberando queryRunner...');
      await queryRunner.release();
      console.log('✅ queryRunner liberado');
    }

    // 7. Auditoría (fuera de la transacción para no bloquear BD)
    try {
      console.log('🔹 Registrando auditoría...');
      await this.auditLogService.log(
        performedBy,
        savedBook.id,
        'CREATE' as any,
        `Book registered: ${savedBook.title} (ISBN: ${savedBook.isbnCode})`,
        'BookCatalog',
      );
      console.log('✅ Auditoría registrada');
    } catch (auditError) {
      console.error('❌ Error registrando auditoría (no crítico):', auditError);
    }

    console.log('🔹 [END] Registro de libro completado');
    return savedBook;
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
    userRole: string = UserRole.USER,
  ): Promise<BookCatalog> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

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

        await queryRunner.manager.update(BookCatalog, { id: bookId }, entityData);
        const result = await queryRunner.manager.findOne(BookCatalog, {
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

        await queryRunner.commitTransaction();
        return result;
      }

      // Hay cambios significativos, proceder con actualización
      await this._validateUniqueConstraints(updateBookCatalogDto, bookId, [
        {
          field: 'isbnCode',
          message: 'El código ISBN ya existe',
          transform: (value: string) => value.trim(),
        },
      ]);

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

      // Crear movimiento de inventario PENDING para cambios significativos
      const movementId = await this.inventoryMovementTrackerService.createPendingMovement(
        {
          entityType: 'BookCatalog',
          entityId: bookId,
          userId: performedBy,
          userFullName: userFullName,
          userRole: userRole,
          quantityBefore: currentBook.stockQuantity,
          quantityAfter: updatedBook.stockQuantity,
          priceBefore: currentBook.price,
          priceAfter: updatedBook.price,
          movementType: this.inventoryMovementTrackerService.determineMovementType(
            false, // isCreate
            false, // isDelete
            currentBook.price, // priceBefore
            updatedBook.price, // priceAfter
            currentBook.stockQuantity, // quantityBefore
            updatedBook.stockQuantity, // quantityAfter
          ),
          notes: `Book updated: ${currentBook.title} - Stock: ${currentBook.stockQuantity} -> ${updatedBook.stockQuantity}, Price: ${currentBook.price} -> ${updatedBook.price}`,
        },
        queryRunner,
      );

      // Registrar auditoría
      await this.auditLogService.log(
        performedBy,
        bookId,
        'UPDATE' as any,
        `Book ${bookId} updated.`,
        'BookCatalog',
      );

      // Marcar movimiento como completado
      await this.inventoryMovementTrackerService.markMovementCompleted(movementId, queryRunner);

      await queryRunner.commitTransaction();
      return updatedBook;
    } catch (error) {
      await queryRunner.rollbackTransaction();

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
    userRole: string = UserRole.USER,
  ): Promise<{ id: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const book = await this.getBookProfile(bookId);

      // Crear movimiento de inventario PENDING para desactivación
      const movementId = await this.inventoryMovementTrackerService.createPendingMovement(
        {
          entityType: 'BookCatalog',
          entityId: bookId,
          userId: performedBy,
          userFullName: userFullName,
          userRole: userRole,
          quantityBefore: book.stockQuantity,
          quantityAfter: 0,
          priceBefore: book.price,
          priceAfter: 0,
          movementType: this.inventoryMovementTrackerService.determineMovementType(
            false, // isCreate
            true, // isDelete
            book.price, // priceBefore
            0, // priceAfter
            book.stockQuantity, // quantityBefore
            0, // quantityAfter
          ),
          notes: `Book archived: ${book.title} - Stock was: ${book.stockQuantity}`,
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

      // Marcar movimiento como completado
      await this.inventoryMovementTrackerService.markMovementCompleted(movementId, queryRunner);

      await queryRunner.commitTransaction();
      return { id: bookId };
    } catch (error) {
      await queryRunner.rollbackTransaction();

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
    managerOrId?: EntityManager | string,
    constraints?: {
      field: keyof BookCatalog;
      message: string;
      transform?: (value: any) => any;
    }[],
  ): Promise<void> {
    if (!constraints) return;

    // Detectar si el segundo argumento es manager o entityId
    let manager: EntityManager | undefined;
    let entityId: string | undefined;

    if (managerOrId instanceof EntityManager) {
      manager = managerOrId;
    } else if (typeof managerOrId === 'string') {
      entityId = managerOrId;
    }

    for (const constraint of constraints) {
      const fieldValue = dto[constraint.field];
      if (!fieldValue) continue;

      const transformedValue = constraint.transform ? constraint.transform(fieldValue) : fieldValue;

      let existingEntity: BookCatalog | null = null;

      if (entityId) {
        // con entityId (excluir el mismo registro)
        existingEntity = await (manager
          ? manager.findOne(BookCatalog, {
              where: { isbnCode: transformedValue, id: Not(entityId) },
            })
          : this.findByIsbnExcludingId(transformedValue, entityId));
      } else {
        existingEntity = await (manager
          ? manager.findOne(BookCatalog, {
              where: { isbnCode: transformedValue },
            })
          : this.findByIsbn(transformedValue));
      }

      if (existingEntity) {
        throw new Error(constraint.message);
      }
    }
  }

  async findForSelect(): Promise<BookCatalog[]> {
    return await this._findMany({
      select: ['id', 'title'],
      where: { isAvailable: true },
      order: { title: 'ASC' },
    });
  }
}
