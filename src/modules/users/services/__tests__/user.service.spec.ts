import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from '../user.service';
import { IUserRepository } from '../../interfaces/user.repository.interface';
import { AuditLogService } from '../../../audit/services/audit-log.service';
import { UserMockFactory, userMockData } from '../../../../common/mocks/user.mock';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserRole } from "../../enums/user-role.enum";
import { PaginationDto } from '../../../../common/dto/pagination.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<IUserRepository>;
  let auditLogService: jest.Mocked<AuditLogService>;

  beforeEach(async () => {
    const mockUserRepository = {
      registerUser: jest.fn(),
      authenticateUser: jest.fn(),
      getUserProfile: jest.fn(),
      updateUserProfile: jest.fn(),
      deactivateUser: jest.fn(),
      getAllUsers: jest.fn(),
      getUsersByRole: jest.fn(),
      searchUsers: jest.fn(),
      checkUsernameExists: jest.fn(),
      checkEmailExists: jest.fn(),
    };

    const mockAuditLogService = {
      logOperation: jest.fn(),
      getAuditTrail: jest.fn(),
      getUserAuditHistory: jest.fn(),
      getEntityAuditHistory: jest.fn(),
      getAuditsByAction: jest.fn(),
      getAuditsByEntityType: jest.fn(),
      searchAuditLogs: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: AuditLogService,
          useValue: mockAuditLogService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get('IUserRepository');
    auditLogService = module.get(AuditLogService);
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: UserRole.USER,
    };

    it('should create a user successfully', async () => {
      const mockUser = UserMockFactory.createOne(createUserDto);
      userRepository.registerUser.mockResolvedValue(mockUser);
      auditLogService.logOperation.mockResolvedValue({} as any);

      const result = await service.create(createUserDto, 'admin123');

      expect(userRepository.registerUser).toHaveBeenCalledWith(createUserDto);
      expect(auditLogService.logOperation).toHaveBeenCalledWith(
        'admin123',
        mockUser.id,
        expect.any(String),
        expect.stringContaining(mockUser.username),
        'User',
      );
      expect(result).toEqual(mockUser);
    });

    it('should handle repository errors', async () => {
      userRepository.registerUser.mockRejectedValue(new ConflictException('Username already exists'));

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(auditLogService.logOperation).not.toHaveBeenCalled();
    });

    it('should work without audit logging', async () => {
      const mockUser = UserMockFactory.createOne(createUserDto);
      userRepository.registerUser.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(auditLogService.logOperation).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const mockUser = userMockData.singleUser;
      userRepository.getUserProfile.mockResolvedValue(mockUser);

      const result = await service.findById(mockUser.id);

      expect(userRepository.getUserProfile).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it('should handle not found cases', async () => {
      userRepository.getUserProfile.mockRejectedValue(new NotFoundException('User not found'));

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const mockUsers = UserMockFactory.createMany(3);
      const paginationDto: PaginationDto = { 
        page: 1, 
        limit: 10, 
        sortBy: 'createdAt', 
        sortOrder: 'DESC',
        offset: 0 
      };
      const mockResult = {
        data: mockUsers,
        meta: {
          total: 3,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

      userRepository.getAllUsers.mockResolvedValue(mockResult);

      const result = await service.findAll(paginationDto);

      expect(userRepository.getAllUsers).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual(mockResult);
      expect(result.data).toHaveLength(3);
    });
  });

  describe("findToLoginByEmail", () => {
    it("should return user when found", async () => {
      const mockUser = UserMockFactory.createRegularUser();
      userRepository.authenticateUser.mockResolvedValue(mockUser);

      const result = await service.findToLoginByEmail("testuser");

      expect(userRepository.authenticateUser).toHaveBeenCalledWith("testuser");
      expect(result).toEqual(mockUser);
    });

    it("should return null when not found", async () => {
      userRepository.authenticateUser.mockResolvedValue(null);

      const result = await service.findToLoginByEmail("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const updateUserDto: UpdateUserDto = { email: 'newemail@test.com' };
      const mockUser = UserMockFactory.createOne({ email: 'newemail@test.com' });
      
      userRepository.updateUserProfile.mockResolvedValue(mockUser);
      auditLogService.logOperation.mockResolvedValue({} as any);

      const result = await service.update('user-id', updateUserDto, 'admin123');

      expect(userRepository.updateUserProfile).toHaveBeenCalledWith('user-id', updateUserDto);
      expect(auditLogService.logOperation).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('softDelete', () => {
    it('should soft delete user successfully', async () => {
      const mockUser = UserMockFactory.createOne();
      
      userRepository.getUserProfile.mockResolvedValue(mockUser);
      userRepository.deactivateUser.mockResolvedValue();
      auditLogService.logOperation.mockResolvedValue({} as any);

      await service.softDelete('user-id', 'admin123');

      expect(userRepository.getUserProfile).toHaveBeenCalledWith('user-id');
      expect(userRepository.deactivateUser).toHaveBeenCalledWith('user-id');
      expect(auditLogService.logOperation).toHaveBeenCalled();
    });
  });
});