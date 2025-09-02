import { User } from '../entities/user.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { UserFiltersDto, UserCsvExportFiltersDto } from '../dto';

export interface IUserSearchRepository {
  searchUsers(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<User>>;
  filterUsers(filterTerm: string, pagination: PaginationDto): Promise<PaginatedResult<User>>;
  simpleFilterUsers(
    term: string,
    pagination: PaginationDto,
    userId?: string,
    userRole?: string,
  ): Promise<PaginatedResult<User>>;
  findUsersWithFilters(
    filters: UserFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<User>>;
  exportUsersToCsv(filters: UserCsvExportFiltersDto): Promise<string>;
  checkUsernameExists(username: string): Promise<boolean>;
  checkEmailExists(email: string): Promise<boolean>;
  authenticateUser(email: string): Promise<User | null>;
}
