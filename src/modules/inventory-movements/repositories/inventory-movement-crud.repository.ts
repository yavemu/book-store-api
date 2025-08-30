import { Injectable, Inject, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, SelectQueryBuilder } from 'typeorm';
import { InventoryMovement } from '../entities/inventory-movement.entity';
import { IInventoryMovementCrudRepository } from '../interfaces/inventory-movement-crud.repository.interface';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { IAuditLoggerService } from '../../audit/interfaces/audit-logger.service.interface';
import { AuditAction } from '../../audit/enums/audit-action.enum';
import { MovementFiltersDto, MovementSearchDto, MovementAdvancedFiltersDto } from '../dto';

@Injectable()
export class InventoryMovementCrudRepository
  extends BaseRepository<InventoryMovement>
  implements IInventoryMovementCrudRepository
{
  constructor(
    @InjectRepository(InventoryMovement)
    private readonly movementRepository: Repository<InventoryMovement>,
    @Inject('IAuditLoggerService')
    protected readonly auditLogService: IAuditLoggerService,
  ) {
    super(movementRepository, auditLogService);
  }

  async getAllMovements(pagination: PaginationDto): Promise<PaginatedResult<InventoryMovement>> {
    try {
      return await this._findManyWithPagination(
        {
          where: { isActive: true },
          order: { createdAt: 'DESC' },
        },
        pagination,
      );
    } catch (error) {
      throw new HttpException(
        'Error al obtener los movimientos de inventario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMovementById(id: string): Promise<InventoryMovement> {
    try {
      const order = await this._findById(id);
      if (!order || !order.isActive) {
        throw new NotFoundException('Movimiento de inventario no encontrado');
      }
      return order;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener el movimiento de inventario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deactivateMovement(id: string, deletedBy?: string): Promise<{ id: string }> {
    try {
      const movement = await this.getMovementById(id);

      await this._softDelete(
        id,
        deletedBy || 'system',
        'InventoryMovement',
        (entity: InventoryMovement) =>
          `Movimiento de inventario desactivado: ${entity.movementType} - ${entity.entityType}:${entity.entityId}`,
      );

      return { id };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al desactivar el movimiento de inventario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchMovements(
    pagination: PaginationDto,
    filters?: MovementFiltersDto,
    search?: MovementSearchDto,
    advancedFilters?: MovementAdvancedFiltersDto,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<PaginatedResult<InventoryMovement>> {
    try {
      const queryBuilder = this.movementRepository.createQueryBuilder('movement');

      this.applyFilters(
        queryBuilder,
        filters,
        search,
        advancedFilters,
        requestingUserId,
        requestingUserRole,
      );

      queryBuilder
        .orderBy(`movement.${pagination.sortBy}`, pagination.sortOrder)
        .skip(pagination.offset)
        .take(pagination.limit);

      const [items, totalItems] = await queryBuilder.getManyAndCount();

      return {
        data: items,
        meta: {
          total: totalItems,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(totalItems / pagination.limit),
          hasNext: pagination.page < Math.ceil(totalItems / pagination.limit),
          hasPrev: pagination.page > 1,
        },
      };
    } catch (error) {
      throw new HttpException(
        'Error al buscar movimientos de inventario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findMovementsForExport(
    filters: MovementFiltersDto,
    search?: MovementSearchDto,
    advancedFilters?: MovementAdvancedFiltersDto,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<InventoryMovement[]> {
    try {
      const queryBuilder = this.movementRepository.createQueryBuilder('movement');

      this.applyFilters(
        queryBuilder,
        filters,
        search,
        advancedFilters,
        requestingUserId,
        requestingUserRole,
      );

      queryBuilder.orderBy('movement.createdAt', 'DESC');

      return await queryBuilder.getMany();
    } catch (error) {
      throw new HttpException(
        'Error al obtener movimientos para exportación',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<InventoryMovement>,
    filters?: MovementFiltersDto,
    search?: MovementSearchDto,
    advancedFilters?: MovementAdvancedFiltersDto,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): void {
    // Control de acceso por rol
    if (requestingUserRole === 'USER') {
      // Los usuarios USER solo pueden ver sus propios movimientos
      queryBuilder.andWhere('movement.userId = :requestingUserId', { requestingUserId });
    } else if (requestingUserRole === 'ADMIN' && filters?.userId) {
      // Los ADMIN pueden filtrar por userId específico o ver todo
      queryBuilder.andWhere('movement.userId = :filterUserId', { filterUserId: filters.userId });
    }

    // Filtros básicos
    if (filters) {
      if (filters.movementType) {
        queryBuilder.andWhere('movement.movementType = :movementType', {
          movementType: filters.movementType,
        });
      }
      if (filters.status) {
        queryBuilder.andWhere('movement.status = :status', { status: filters.status });
      }
      if (filters.entityType) {
        queryBuilder.andWhere('movement.entityType = :entityType', {
          entityType: filters.entityType,
        });
      }
      if (filters.entityId) {
        queryBuilder.andWhere('movement.entityId = :entityId', { entityId: filters.entityId });
      }
      if (filters.userRole) {
        queryBuilder.andWhere('movement.userRole = :userRole', { userRole: filters.userRole });
      }
      if (filters.startDate) {
        queryBuilder.andWhere('movement.createdAt >= :startDate', { startDate: filters.startDate });
      }
      if (filters.endDate) {
        queryBuilder.andWhere('movement.createdAt <= :endDate', {
          endDate: filters.endDate + 'T23:59:59.999Z',
        });
      }
      if (filters.isActive !== undefined) {
        queryBuilder.andWhere('movement.isActive = :isActive', { isActive: filters.isActive });
      }
    }

    // Filtros de búsqueda por texto
    if (search) {
      if (search.searchTerm) {
        queryBuilder.andWhere(
          '(movement.notes ILIKE :searchTerm OR movement.userFullName ILIKE :searchTerm OR movement.entityType ILIKE :searchTerm)',
          { searchTerm: `%${search.searchTerm}%` },
        );
      }
      if (search.userFullName) {
        queryBuilder.andWhere('movement.userFullName ILIKE :userFullName', {
          userFullName: `%${search.userFullName}%`,
        });
      }
      if (search.notes) {
        queryBuilder.andWhere('movement.notes ILIKE :notes', { notes: `%${search.notes}%` });
      }
    }

    // Filtros avanzados por rangos numéricos
    if (advancedFilters) {
      if (advancedFilters.minPriceBefore !== undefined) {
        queryBuilder.andWhere('movement.priceBefore >= :minPriceBefore', {
          minPriceBefore: advancedFilters.minPriceBefore,
        });
      }
      if (advancedFilters.maxPriceBefore !== undefined) {
        queryBuilder.andWhere('movement.priceBefore <= :maxPriceBefore', {
          maxPriceBefore: advancedFilters.maxPriceBefore,
        });
      }
      if (advancedFilters.minPriceAfter !== undefined) {
        queryBuilder.andWhere('movement.priceAfter >= :minPriceAfter', {
          minPriceAfter: advancedFilters.minPriceAfter,
        });
      }
      if (advancedFilters.maxPriceAfter !== undefined) {
        queryBuilder.andWhere('movement.priceAfter <= :maxPriceAfter', {
          maxPriceAfter: advancedFilters.maxPriceAfter,
        });
      }
      if (advancedFilters.minQuantityBefore !== undefined) {
        queryBuilder.andWhere('movement.quantityBefore >= :minQuantityBefore', {
          minQuantityBefore: advancedFilters.minQuantityBefore,
        });
      }
      if (advancedFilters.maxQuantityBefore !== undefined) {
        queryBuilder.andWhere('movement.quantityBefore <= :maxQuantityBefore', {
          maxQuantityBefore: advancedFilters.maxQuantityBefore,
        });
      }
      if (advancedFilters.minQuantityAfter !== undefined) {
        queryBuilder.andWhere('movement.quantityAfter >= :minQuantityAfter', {
          minQuantityAfter: advancedFilters.minQuantityAfter,
        });
      }
      if (advancedFilters.maxQuantityAfter !== undefined) {
        queryBuilder.andWhere('movement.quantityAfter <= :maxQuantityAfter', {
          maxQuantityAfter: advancedFilters.maxQuantityAfter,
        });
      }
    }
  }
}
