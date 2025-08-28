import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { IUserRepository } from '../../interfaces/user.repository.interface';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { PaginationDto, PaginatedResult } from '../../../../common/dto/pagination.dto';
import { Role } from '../../../roles/entities/role.entity';

const mockRole: Role = {
    id: '1',
    name: 'user',
    description: 'user role',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    users: [],
    normalizeRoleName: jest.fn(),
  };

  const mockUser: User = {
    id: '1',
    username: 'test',
    password: 'hashedpassword',
    email: 'test@test.com',
    roleId: '1',
    role: mockRole,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    hashPassword: jest.fn(),
    normalizeEmail: jest.fn(),
    normalizeUsername: jest.fn(),
  };

describe('UserService', () => {
  let service: UserService;
  let repository: IUserRepository;

  const mockUserRepository = {
    registerUser: jest.fn(),
    getAllUsers: jest.fn(),
    getUserProfile: jest.fn(),
    authenticateUser: jest.fn(),
    checkEmailExists: jest.fn(),
    updateUserProfile: jest.fn(),
    deactivateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<IUserRepository>('IUserRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {} as any;
      mockUserRepository.registerUser.mockResolvedValue(mockUser);
      const result = await service.create(createUserDto, 'admin');
      expect(repository.registerUser).toHaveBeenCalledWith(createUserDto, 'admin');
      expect(result).toEqual(mockUser);
    });
  });

  describe('register', () => {
    it('should register a user', async () => {
        const registerUserDto: any = {};
        mockUserRepository.registerUser.mockResolvedValue(mockUser);
        const result = await service.register(registerUserDto, 'admin');
        expect(repository.registerUser).toHaveBeenCalledWith(registerUserDto, 'admin');
        expect(result).toEqual(mockUser);
      });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const pagination: PaginationDto = { limit: 10, offset: 0, page: 1, sortBy: 'username', sortOrder: 'ASC' };
      const paginatedResult: PaginatedResult<User> = { data: [mockUser], meta: {} as any };
      mockUserRepository.getAllUsers.mockResolvedValue(paginatedResult);
      const result = await service.findAll(pagination);
      expect(repository.getAllUsers).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      mockUserRepository.getUserProfile.mockResolvedValue(mockUser);
      const result = await service.findById('1');
      expect(repository.getUserProfile).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('findToLoginByEmail', () => {
    it('should return a user by email for login', async () => {
        mockUserRepository.authenticateUser.mockResolvedValue(mockUser);
        const result = await service.findToLoginByEmail('test@test.com');
        expect(repository.authenticateUser).toHaveBeenCalledWith('test@test.com');
        expect(result).toEqual(mockUser);
      });
  });

  describe('findByEmail', () => {
    it('should return true if email exists', async () => {
        mockUserRepository.checkEmailExists.mockResolvedValue(true);
        const result = await service.findByEmail('test@test.com');
        expect(repository.checkEmailExists).toHaveBeenCalledWith('test@test.com');
        expect(result).toBe(true);
      });
  });

  describe('update', () => {
    it('should update a user', async () => {
        const updateUserDto: UpdateUserDto = {} as any;
        mockUserRepository.updateUserProfile.mockResolvedValue(mockUser);
        const result = await service.update('1', updateUserDto, 'admin');
        expect(repository.updateUserProfile).toHaveBeenCalledWith('1', updateUserDto, 'admin');
        expect(result).toEqual(mockUser);
      });
  });

  describe('softDelete', () => {
    it('should soft delete a user', async () => {
        mockUserRepository.deactivateUser.mockResolvedValue(undefined);
        const result = await service.softDelete('1', 'admin');
        expect(repository.deactivateUser).toHaveBeenCalledWith('1', 'admin');
        expect(result).toEqual({ message: 'User deleted successfully' });
      });
  });
});
