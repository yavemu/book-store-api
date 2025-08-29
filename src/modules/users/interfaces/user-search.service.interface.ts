import { User } from '../entities/user.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IUserSearchService {
  search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<User>>;
  findByEmail(email: string): Promise<boolean>;
  findToLoginByEmail(email: string): Promise<User | null>;
}
