import { User } from '../entities/user.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { UserFiltersDto, UserCsvExportFiltersDto } from '../dto';

export interface IUserSearchService {
  search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<User>>;
  filterSearch(filterTerm: string, pagination: PaginationDto): Promise<PaginatedResult<User>>;
  findWithFilters(
    filters: UserFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<User>>;
  exportToCsv(filters: UserCsvExportFiltersDto): Promise<string>;
  findByEmail(email: string): Promise<boolean>;
  findToLoginByEmail(email: string): Promise<User | null>;
}
