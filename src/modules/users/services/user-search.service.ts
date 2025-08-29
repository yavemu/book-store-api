import { Injectable, Inject } from '@nestjs/common';
import { IUserSearchService } from '../interfaces/user-search.service.interface';
import { IUserSearchRepository } from '../interfaces/user-search.repository.interface';
import { User } from '../entities/user.entity';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';

@Injectable()
export class UserSearchService implements IUserSearchService {
  constructor(
    @Inject('IUserSearchRepository')
    private readonly userSearchRepository: IUserSearchRepository,
  ) {}

  async search(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<User>> {
    return this.userSearchRepository.searchUsers(searchTerm, pagination);
  }

  async findByEmail(email: string): Promise<boolean> {
    return this.userSearchRepository.checkEmailExists(email);
  }

  async findToLoginByEmail(email: string): Promise<User | null> {
    return this.userSearchRepository.authenticateUser(email);
  }
}
