import { User } from '../entities/user.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import {
  UserFiltersDto,
  UserCsvExportFiltersDto,
  UserExactSearchDto,
  UserSimpleFilterDto,
} from '../dto';

export interface IUserSearchService {
  exactSearch(
    searchDto: UserExactSearchDto,
    userId?: string,
    userRole?: string,
  ): Promise<PaginatedResult<User>>;
  simpleFilter(
    term: string,
    pagination: PaginationDto,
    userId?: string,
    userRole?: string,
  ): Promise<PaginatedResult<User>>;
  findWithFilters(
    filters: UserFiltersDto,
    pagination: PaginationDto,
    userId?: string,
    userRole?: string,
  ): Promise<PaginatedResult<User>>;
  exportToCsv(filters: UserCsvExportFiltersDto): Promise<string>;
  findByEmail(email: string): Promise<boolean>;
  findToLoginByEmail(email: string): Promise<User | null>;
}
