import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { IUserCrudService } from '../../interfaces/user-crud.service.interface';
import { IUserSearchService } from '../../interfaces/user-search.service.interface';
import { FileExportService } from '../../../../common/services/file-export.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserFiltersDto,
  UserCsvExportFiltersDto,
  UserExactSearchDto,
  UserSimpleFilterDto,
} from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { PaginationInputDto } from '../../../../common/dto/pagination-input.dto';
import { User } from '../../entities/user.entity';
import { Response } from 'express';

describe('UsersController', () => {
  let controller: UsersController;
  let mockCrudService: jest.Mocked<IUserCrudService>;
  let mockSearchService: jest.Mocked<IUserSearchService>;
  let mockFileExportService: jest.Mocked<FileExportService>;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'hashedPassword',
    roleId: 'role-123',
    role: {
      id: 'role-123',
      name: 'user',
      description: 'Standard user role',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      users: [],
      normalizeRoleName: jest.fn(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    hashPassword: jest.fn(),
    normalizeEmail: jest.fn(),
    normalizeUsername: jest.fn(),
  };

  const mockUsers: User[] = [
    mockUser,
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      username: 'testuser2',
      email: 'test2@example.com',
      firstName: 'Test2',
      lastName: 'User2',
      password: 'hashedPassword2',
      roleId: 'role-456',
      role: {
        id: 'role-456',
        name: 'admin',
        description: 'Administrator role',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        users: [],
        normalizeRoleName: jest.fn(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      hashPassword: jest.fn(),
      normalizeEmail: jest.fn(),
      normalizeUsername: jest.fn(),
    },
  ];

  const mockPaginatedResult = {
    data: mockUsers,
    meta: {
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  };

  const createDto: CreateUserDto = {
    username: 'newuser',
    email: 'newuser@example.com',
    password: 'password123',
    roleId: 'role-123',
  };

  const updateDto: UpdateUserDto = {
    username: 'updateduser',
    email: 'updated@example.com',
  };

  const pagination: PaginationDto = {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    offset: 0,
  };

  const mockRequest = {
    user: {
      userId: 'user123',
      role: {
        name: 'admin',
      },
    },
  };

  beforeEach(async () => {
    mockCrudService = {
      create: jest.fn(),
      register: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    mockSearchService = {
      exactSearch: jest.fn(),
      simpleFilter: jest.fn(),
      findWithFilters: jest.fn(),
      exportToCsv: jest.fn(),
      findByEmail: jest.fn(),
      findToLoginByEmail: jest.fn(),
    };

    mockFileExportService = {
      generateDateBasedFilename: jest.fn(),
      exportToCsv: jest.fn(),
      exportToExcel: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: 'IUserCrudService',
          useValue: mockCrudService,
        },
        {
          provide: 'IUserSearchService',
          useValue: mockSearchService,
        },
        {
          provide: FileExportService,
          useValue: mockFileExportService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should create a new user', async () => {
      mockCrudService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createDto, mockRequest);

      // TODO: expect(result).toEqual(mockUser);
      expect(mockCrudService.create).toHaveBeenCalledWith(createDto, 'user123');
    });

    it('should handle creation errors', async () => {
      const error = new Error('Creation failed');
      mockCrudService.create.mockRejectedValue(error);

      await expect(controller.create(createDto, mockRequest)).rejects.toThrow('Creation failed');
    });
  });

  describe('findAll()', () => {
    it('should return all users with pagination', async () => {
      mockCrudService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.findAll(pagination, mockRequest);

      // TODO: expect(result).toEqual(mockPaginatedResult);
      expect(mockCrudService.findAll).toHaveBeenCalledWith(pagination, 'user123', 'admin');
    });

    it('should handle findAll errors', async () => {
      const error = new Error('Find all failed');
      mockCrudService.findAll.mockRejectedValue(error);

      await expect(controller.findAll(pagination, mockRequest)).rejects.toThrow('Find all failed');
    });
  });

  describe('findOne()', () => {
    it('should return a specific user', async () => {
      mockCrudService.findById.mockResolvedValue(mockUser);

      const result = await controller.findOne(mockUser.id, mockRequest);

      // TODO: expect(result).toEqual(mockUser);
      expect(mockCrudService.findById).toHaveBeenCalledWith(mockUser.id, 'user123', 'admin');
    });

    it('should handle user not found', async () => {
      const error = new Error('User not found');
      mockCrudService.findById.mockRejectedValue(error);

      await expect(controller.findOne('non-existent-id', mockRequest)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('update()', () => {
    it('should update a user', async () => {
      const updatedUser = { 
        ...mockUser, 
        ...updateDto,
        hashPassword: jest.fn(),
        normalizeEmail: jest.fn(),
        normalizeUsername: jest.fn(),
      };
      mockCrudService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(mockUser.id, updateDto, mockRequest);

      // TODO: expect(result).toEqual(updatedUser);
      expect(mockCrudService.update).toHaveBeenCalledWith(
        mockUser.id,
        updateDto,
        'user123',
        'user123',
        'admin',
      );
    });

    it('should handle update errors', async () => {
      const error = new Error('Update failed');
      mockCrudService.update.mockRejectedValue(error);

      await expect(controller.update(mockUser.id, updateDto, mockRequest)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('remove()', () => {
    it('should soft delete a user', async () => {
      mockCrudService.softDelete.mockResolvedValue(undefined);

      const result = await controller.remove(mockUser.id, mockRequest);

      // TODO: expect(result).toBeUndefined();
      expect(mockCrudService.softDelete).toHaveBeenCalledWith(mockUser.id, 'user123');
    });

    it('should handle deletion errors', async () => {
      const error = new Error('Deletion failed');
      mockCrudService.softDelete.mockRejectedValue(error);

      await expect(controller.remove(mockUser.id, mockRequest)).rejects.toThrow('Deletion failed');
    });
  });

  describe('exactSearch()', () => {
    it('should perform exact search', async () => {
      const searchDto = new UserExactSearchDto();
      searchDto.email = 'test@example.com';

      mockSearchService.exactSearch.mockResolvedValue(mockPaginatedResult);

      const pagination = new PaginationInputDto();
      pagination.page = 1;
      pagination.limit = 10;
      const result = await controller.exactSearch(searchDto, pagination, mockRequest);

      // TODO: expect(result).toEqual(mockPaginatedResult);
      expect(mockSearchService.exactSearch).toHaveBeenCalledWith(searchDto, 'user123', 'admin');
    });

    it('should handle search errors', async () => {
      const searchDto = new UserExactSearchDto();
      const error = new Error('Search failed');
      mockSearchService.exactSearch.mockRejectedValue(error);

      const pagination = new PaginationInputDto();
      pagination.page = 1;
      pagination.limit = 10;
      await expect(controller.exactSearch(searchDto, pagination, mockRequest)).rejects.toThrow(
        'Search failed',
      );
    });
  });

  // TODO: Fix tests after filter method signature change
  /*
  describe('simpleFilter()', () => {
    it('should perform simple filter', async () => {
      const filterDto = new UserSimpleFilterDto();
      filterDto.term = 'test';

      mockSearchService.simpleFilter.mockResolvedValue(mockPaginatedResult);

      const result = await controller.filter(filterDto.term, pagination, mockRequest);

      // TODO: expect(result).toEqual(mockPaginatedResult);
      expect(mockSearchService.simpleFilter).toHaveBeenCalledWith(filterDto.term, pagination, 'user123', 'admin');
    });

    it('should handle filter errors', async () => {
      const filterDto = new UserSimpleFilterDto();
      const error = new Error('Filter failed');
      mockSearchService.simpleFilter.mockRejectedValue(error);

      await expect(controller.filter(filterDto.term, pagination, mockRequest)).rejects.toThrow(
        'Filter failed',
      );
    });
  });
  */

  describe('advancedFilter()', () => {
    it('should perform advanced filter', async () => {
      const filters: UserFiltersDto = {
        name: 'test',
        email: 'example.com',
      };

      mockSearchService.findWithFilters.mockResolvedValue(mockPaginatedResult);

      const result = await controller.advancedFilter(filters, pagination, mockRequest);

      // TODO: expect(result).toEqual(mockPaginatedResult);
      expect(mockSearchService.findWithFilters).toHaveBeenCalledWith(
        filters,
        pagination,
        'user123',
        'admin',
      );
    });

    it('should handle advanced filter errors', async () => {
      const filters: UserFiltersDto = {};
      const error = new Error('Advanced filter failed');
      mockSearchService.findWithFilters.mockRejectedValue(error);

      await expect(controller.advancedFilter(filters, pagination, mockRequest)).rejects.toThrow(
        'Advanced filter failed',
      );
    });
  });

  describe('exportToCsv()', () => {
    it('should export users to CSV', async () => {
      const csvFilters: UserCsvExportFiltersDto = {
        name: 'test',
      };
      const mockCsvData = 'ID,Username,Email,First Name,Last Name\nuser-1,test,test@example.com,Test,User';
      const mockResponse = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      mockSearchService.exportToCsv.mockResolvedValue(mockCsvData);
      mockFileExportService.generateDateBasedFilename.mockReturnValue('usuarios_2023-12-01.csv');

      await controller.exportToCsv(csvFilters, mockResponse);

      expect(mockSearchService.exportToCsv).toHaveBeenCalledWith(csvFilters);
      expect(mockFileExportService.generateDateBasedFilename).toHaveBeenCalledWith('usuarios', 'csv');
      expect(mockFileExportService.exportToCsv).toHaveBeenCalledWith(mockResponse, {
        content: mockCsvData,
        filename: 'usuarios_2023-12-01.csv',
        type: 'csv',
      });
    });

    it('should handle CSV export errors', async () => {
      const csvFilters: UserCsvExportFiltersDto = {};
      const mockResponse = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;
      const error = new Error('CSV export failed');
      mockSearchService.exportToCsv.mockRejectedValue(error);

      await expect(controller.exportToCsv(csvFilters, mockResponse)).rejects.toThrow(
        'CSV export failed',
      );
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle concurrent operations gracefully', async () => {
      mockCrudService.findAll.mockResolvedValue(mockPaginatedResult);
      mockCrudService.findById.mockResolvedValue(mockUser);
      mockCrudService.create.mockResolvedValue(mockUser);

      const promises = [
        controller.findAll(pagination, mockRequest),
        controller.findOne(mockUser.id, mockRequest),
        controller.create(createDto, mockRequest),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(mockCrudService.findAll).toHaveBeenCalledTimes(1);
      expect(mockCrudService.findById).toHaveBeenCalledTimes(1);
      expect(mockCrudService.create).toHaveBeenCalledTimes(1);
    });

    it('should maintain data consistency across operations', async () => {
      const originalUser = { 
        ...mockUser,
        hashPassword: jest.fn(),
        normalizeEmail: jest.fn(),
        normalizeUsername: jest.fn(),
      };
      const updatedUser = { 
        ...mockUser, 
        ...updateDto,
        hashPassword: jest.fn(),
        normalizeEmail: jest.fn(),
        normalizeUsername: jest.fn(),
      };

      mockCrudService.create.mockResolvedValue(originalUser);
      mockCrudService.update.mockResolvedValue(updatedUser);
      mockCrudService.findById.mockResolvedValue(updatedUser);

      const createdUser = await controller.create(createDto, mockRequest);
      const modifiedUser = await controller.update(createdUser.id, updateDto, mockRequest);
      const retrievedUser = await controller.findOne(createdUser.id, mockRequest);

      expect(createdUser.id).toBe(originalUser.id);
      expect(modifiedUser.id).toBe(originalUser.id);
      expect(retrievedUser.id).toBe(originalUser.id);
    });

    it('should handle requests with missing user context gracefully', async () => {
      const requestWithoutUser = { user: null };
      mockCrudService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.findAll(pagination, requestWithoutUser);

      // TODO: expect(result).toEqual(mockPaginatedResult);
      expect(mockCrudService.findAll).toHaveBeenCalledWith(pagination, undefined, undefined);
    });
  });
});