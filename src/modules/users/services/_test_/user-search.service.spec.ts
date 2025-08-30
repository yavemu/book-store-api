import { Test, TestingModule } from '@nestjs/testing';
import { UserSearchService } from '../user-search.service';
import { IUserSearchRepository } from '../../interfaces/user-search.repository.interface';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { User } from '../../entities/user.entity';

describe('UserSearchService', () => {
  let service: UserSearchService;
  let searchRepository: IUserSearchRepository;

  const mockUser: Partial<User> = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: '$2b$10$hashedpassword',
    roleId: 'role-1',
    role: {
      id: 'role-1',
      name: 'USER',
      description: 'Regular user role',
      permissions: [],
      users: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    } as any,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockSearchRepository = {
    searchUsers: jest.fn(),
    checkUsernameExists: jest.fn(),
    checkEmailExists: jest.fn(),
    authenticateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSearchService,
        { provide: 'IUserSearchRepository', useValue: mockSearchRepository },
      ],
    }).compile();

    service = module.get<UserSearchService>(UserSearchService);
    searchRepository = module.get<IUserSearchRepository>('IUserSearchRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('should search users by term', async () => {
      const searchTerm = 'test';
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockUser], meta: { total: 1, page: 1, limit: 10 } };
      mockSearchRepository.searchUsers.mockResolvedValue(paginatedResult);

      const result = await service.search(searchTerm, pagination);

      expect(searchRepository.searchUsers).toHaveBeenCalledWith(searchTerm, pagination);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findByEmail', () => {
    it('should check if email exists and return true', async () => {
      const email = 'test@example.com';
      mockSearchRepository.checkEmailExists.mockResolvedValue(true);

      const result = await service.findByEmail(email);

      expect(searchRepository.checkEmailExists).toHaveBeenCalledWith(email);
      expect(result).toBe(true);
    });

    it('should check if email exists and return false', async () => {
      const email = 'notfound@example.com';
      mockSearchRepository.checkEmailExists.mockResolvedValue(false);

      const result = await service.findByEmail(email);

      expect(searchRepository.checkEmailExists).toHaveBeenCalledWith(email);
      expect(result).toBe(false);
    });
  });

  describe('findToLoginByEmail', () => {
    it('should find user for login by email', async () => {
      const email = 'test@example.com';
      mockSearchRepository.authenticateUser.mockResolvedValue(mockUser as User);

      const result = await service.findToLoginByEmail(email);

      expect(searchRepository.authenticateUser).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found for login', async () => {
      const email = 'notfound@example.com';
      mockSearchRepository.authenticateUser.mockResolvedValue(null);

      const result = await service.findToLoginByEmail(email);

      expect(searchRepository.authenticateUser).toHaveBeenCalledWith(email);
      expect(result).toBe(null);
    });
  });
});
