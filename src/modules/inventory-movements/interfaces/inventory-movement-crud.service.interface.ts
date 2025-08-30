import { InventoryMovement } from '../entities/inventory-movement.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { MovementFiltersDto, MovementSearchDto, MovementAdvancedFiltersDto } from '../dto';

export interface IInventoryMovementCrudService {
  findAll(pagination: PaginationDto): Promise<PaginatedResult<InventoryMovement>>;
  findById(id: string): Promise<InventoryMovement>;
  softDelete(id: string, deletedBy?: string): Promise<{ id: string }>;
  searchMovements(
    pagination: PaginationDto,
    filters?: MovementFiltersDto,
    search?: MovementSearchDto,
    advancedFilters?: MovementAdvancedFiltersDto,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<PaginatedResult<InventoryMovement>>;
  exportMovementsCsv(
    filters: MovementFiltersDto,
    search?: MovementSearchDto,
    advancedFilters?: MovementAdvancedFiltersDto,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<string>;
}
