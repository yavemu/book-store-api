import { Injectable, Inject } from '@nestjs/common';
import { IInventoryMovementCrudService } from '../interfaces/inventory-movement-crud.service.interface';
import { IInventoryMovementCrudRepository } from '../interfaces/inventory-movement-crud.repository.interface';
import { InventoryMovement } from '../entities/inventory-movement.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { MovementFiltersDto, MovementSearchDto, MovementAdvancedFiltersDto } from '../dto';

@Injectable()
export class InventoryMovementCrudService implements IInventoryMovementCrudService {
  constructor(
    @Inject('IInventoryMovementCrudRepository')
    private readonly movementCrudRepository: IInventoryMovementCrudRepository,
  ) {}

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<InventoryMovement>> {
    return this.movementCrudRepository.getAllMovements(pagination);
  }

  async findById(id: string): Promise<InventoryMovement> {
    return this.movementCrudRepository.getMovementById(id);
  }

  async softDelete(id: string, deletedBy?: string): Promise<{ id: string }> {
    return this.movementCrudRepository.deactivateMovement(id, deletedBy);
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
}
