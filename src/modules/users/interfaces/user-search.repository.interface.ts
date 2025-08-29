import { User } from '../entities/user.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IUserSearchRepository {
  searchUsers(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<User>>;
  checkUsernameExists(username: string): Promise<boolean>;
  checkEmailExists(email: string): Promise<boolean>;
  authenticateUser(email: string): Promise<User | null>;
}
