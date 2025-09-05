import { Injectable, Inject } from '@nestjs/common';
import { IInventoryMovementCrudService } from '../interfaces/inventory-movement-crud.service.interface';
import { IInventoryMovementCrudRepository } from '../interfaces/inventory-movement-crud.repository.interface';
import { InventoryMovement } from '../entities/inventory-movement.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { ListSelectDto } from '../../../common/dto/list-select.dto';
import { MovementType } from '../enums/movement-type.enum';
import {
  MovementFiltersDto,
  MovementSearchDto,
  MovementAdvancedFiltersDto,
  InventoryMovementExactSearchDto,
  InventoryMovementSimpleFilterDto,
} from '../dto';

@Injectable()
export class InventoryMovementCrudService implements IInventoryMovementCrudService {
  constructor(
    @Inject('IInventoryMovementCrudRepository')
    private readonly movementCrudRepository: IInventoryMovementCrudRepository,
  ) {}

  async findAll(
    pagination: PaginationDto,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<PaginatedResult<InventoryMovement>> {
    return this.movementCrudRepository.getAllMovements(
      pagination,
      requestingUserId,
      requestingUserRole,
    );
  }

  async findById(
    id: string,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<InventoryMovement> {
    return this.movementCrudRepository.getMovementById(id, requestingUserId, requestingUserRole);
  }

  async softDelete(id: string, deletedBy?: string): Promise<{ id: string }> {
    return this.movementCrudRepository.deactivateMovement(id, deletedBy);
  }

  async exactSearchMovements(
    searchDto: InventoryMovementExactSearchDto,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<PaginatedResult<InventoryMovement>> {
    return this.movementCrudRepository.exactSearchMovements(
      searchDto,
      requestingUserId,
      requestingUserRole,
    );
  }

  async simpleFilterMovements(
    term: string,
    pagination: PaginationDto,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<PaginatedResult<InventoryMovement>> {
    return this.movementCrudRepository.simpleFilterMovements(
      term,
      pagination,
      requestingUserId,
      requestingUserRole,
    );
  }

  async advancedFilterMovements(
    filters: MovementAdvancedFiltersDto,
    pagination: PaginationDto,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<PaginatedResult<InventoryMovement>> {
    return this.movementCrudRepository.advancedFilterMovements(
      filters,
      pagination,
      requestingUserId,
      requestingUserRole,
    );
  }

  async searchMovements(
    pagination: PaginationDto,
    filters?: MovementFiltersDto,
    search?: MovementSearchDto,
    advancedFilters?: MovementAdvancedFiltersDto,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<PaginatedResult<InventoryMovement>> {
    return this.movementCrudRepository.searchMovements(
      pagination,
      filters,
      search,
      advancedFilters,
      requestingUserId,
      requestingUserRole,
    );
  }

  async exportMovementsCsv(
    filters: MovementFiltersDto,
    search?: MovementSearchDto,
    advancedFilters?: MovementAdvancedFiltersDto,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<string> {
    const movements = await this.movementCrudRepository.findMovementsForExport(
      filters,
      search,
      advancedFilters,
      requestingUserId,
      requestingUserRole,
    );

    const csvHeaders = [
      'ID',
      'Tipo de Movimiento',
      'Estado',
      'Tipo de Entidad',
      'ID de Entidad',
      'Usuario',
      'Rol de Usuario',
      'Precio Anterior',
      'Precio Posterior',
      'Cantidad Anterior',
      'Cantidad Posterior',
      'Notas',
      'Fecha de Creación',
    ];

    const csvRows = movements.map((movement) => [
      movement.id,
      movement.movementType,
      movement.status,
      movement.entityType,
      movement.entityId,
      movement.userFullName || 'N/A',
      movement.userRole || 'N/A',
      movement.priceBefore?.toString() || '0',
      movement.priceAfter?.toString() || '0',
      movement.quantityBefore?.toString() || '0',
      movement.quantityAfter?.toString() || '0',
      movement.notes || '',
      movement.createdAt?.toISOString() || '',
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }

  async findForSelect(): Promise<ListSelectDto[]> {
    return await this.movementCrudRepository.findForSelect();
  }

  private getMovementTypeInSpanish(movementType: MovementType): string {
    switch (movementType) {
      case MovementType.PURCHASE:
        return 'COMPRA';
      case MovementType.SALE:
        return 'VENTA';
      case MovementType.DISCOUNT:
        return 'DESCUENTO';
      case MovementType.INCREASE:
        return 'AUMENTO';
      case MovementType.OUT_OF_STOCK:
        return 'SIN STOCK';
      case MovementType.ARCHIVED:
        return 'ARCHIVADO';
      default:
        return movementType;
    }
  }
}
