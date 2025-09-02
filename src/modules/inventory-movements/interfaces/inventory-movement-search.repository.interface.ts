import { InventoryMovement } from '../entities/inventory-movement.entity';
import { MovementFiltersDto } from '../dto/movement-filters.dto';
import { MovementAdvancedFiltersDto } from '../dto/movement-advanced-filters.dto';
import { InventoryMovementExactSearchDto } from '../dto/inventory-movement-exact-search.dto';
import { InventoryMovementSimpleFilterDto } from '../dto/inventory-movement-simple-filter.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IInventoryMovementSearchRepository {
  exactSearchMovements(
    searchDto: InventoryMovementExactSearchDto,
    userId?: string,
    userRole?: string,
  ): Promise<PaginatedResult<InventoryMovement>>;

  simpleFilterMovements(
    filterDto: InventoryMovementSimpleFilterDto,
    userId?: string,
    userRole?: string,
  ): Promise<PaginatedResult<InventoryMovement>>;

  findWithFilters(
    filters: MovementAdvancedFiltersDto,
    pagination: PaginationDto,
    userId?: string,
    userRole?: string,
  ): Promise<PaginatedResult<InventoryMovement>>;

  exportToCsv(filters?: MovementFiltersDto, userId?: string, userRole?: string): Promise<string>;
}
