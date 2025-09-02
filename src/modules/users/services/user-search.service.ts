import { Injectable, Inject } from '@nestjs/common';
import { IUserSearchService } from '../interfaces/user-search.service.interface';
import { IUserSearchRepository } from '../interfaces/user-search.repository.interface';
import { User } from '../entities/user.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { UserFiltersDto, UserCsvExportFiltersDto } from '../dto';

@Injectable()
export class UserSearchService implements IUserSearchService {
  constructor(
    @Inject('IUserSearchRepository')
    private readonly userSearchRepository: IUserSearchRepository,
  ) {}

  async search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<User>> {
    return this.userSearchRepository.searchUsers(searchTerm, pagination);
  }

  async filterSearch(
    filterTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<User>> {
    // Validación: mínimo 3 caracteres y trim
    if (!filterTerm || filterTerm.trim().length < 3) {
      throw new Error('Filter term must be at least 3 characters long');
    }

    const trimmedTerm = filterTerm.trim();
    return this.userSearchRepository.filterUsers(trimmedTerm, pagination);
  }

  async findByEmail(email: string): Promise<boolean> {
    return this.userSearchRepository.checkEmailExists(email);
  }

  async findWithFilters(
    filters: UserFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<User>> {
    return this.userSearchRepository.findUsersWithFilters(filters, pagination);
  }

  async exportToCsv(filters: UserCsvExportFiltersDto): Promise<string> {
    return this.userSearchRepository.exportUsersToCsv(filters);
  }

  async findToLoginByEmail(email: string): Promise<User | null> {
    return this.userSearchRepository.authenticateUser(email);
  }

  // Methods required by IUserSearchService interface
  async exactSearch(searchDto: any): Promise<PaginatedResult<User>> {
    return this.search(searchDto.searchTerm || '', searchDto);
  }

  async simpleFilter(
    term: string,
    pagination: PaginationDto,
    userId?: string,
    userRole?: string,
  ): Promise<PaginatedResult<User>> {
    return this.userSearchRepository.simpleFilterUsers(term, pagination, userId, userRole);
  }
}
