import { InventoryMovement } from '../entities/inventory-movement.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import {
  MovementFiltersDto,
  MovementSearchDto,
  MovementAdvancedFiltersDto,
  InventoryMovementExactSearchDto,
  InventoryMovementSimpleFilterDto,
} from '../dto';

export interface IInventoryMovementCrudRepository {
  getAllMovements(
    pagination: PaginationDto,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<PaginatedResult<InventoryMovement>>;
  getMovementById(
    id: string,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<InventoryMovement>;
  deactivateMovement(id: string, deletedBy?: string): Promise<{ id: string }>;
  exactSearchMovements(
    searchDto: InventoryMovementExactSearchDto,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<PaginatedResult<InventoryMovement>>;
  simpleFilterMovements(
    term: string,
    pagination: PaginationDto,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<PaginatedResult<InventoryMovement>>;
  advancedFilterMovements(
    filters: MovementAdvancedFiltersDto,
    pagination: PaginationDto,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<PaginatedResult<InventoryMovement>>;
  searchMovements(
    pagination: PaginationDto,
    filters?: MovementFiltersDto,
    search?: MovementSearchDto,
    advancedFilters?: MovementAdvancedFiltersDto,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<PaginatedResult<InventoryMovement>>;
  findMovementsForExport(
    filters: MovementFiltersDto,
    search?: MovementSearchDto,
    advancedFilters?: MovementAdvancedFiltersDto,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<InventoryMovement[]>;
}
