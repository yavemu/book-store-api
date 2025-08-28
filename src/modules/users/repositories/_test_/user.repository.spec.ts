import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../user.repository';
import { User } from '../../entities/user.entity';
import { Role } from '../../../roles/entities/role.entity';
import { CreateUserDto, UpdateUserDto } from '../../dto';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto } from '../../../../common/dto';
import { SuccessResponseDto } from '../../../../common/dto/success-response.dto';

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

describe('UserRepository', () => {
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Role),
          useValue: {},
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('registerUser', () => {
    it('should register a user and return success response', async () => {
      const mockSuccessResponse = new SuccessResponseDto('Created', mockUser);
      (repository as any)._createEntity = jest
        .fn()
        .mockResolvedValue(mockSuccessResponse);
      (repository as any)._validateUniqueConstraints = jest
        .fn()
        .mockResolvedValue(undefined);
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        email: 'new@test.com',
        password: 'password',
        roleId: '1',
      };
      const result = await repository.registerUser(createUserDto);
      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(mockUser);
    });
  });

  describe('getUserProfile', () => {
    it('should return a user profile in a success response', async () => {
      (repository as any)._findById = jest.fn().mockResolvedValue(mockUser);
      const result = await repository.getUserProfile('1');
      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(mockUser);
    });
  });

  describe('updateUserProfile', () => {
    it('should update a user profile and return success response', async () => {
      const updateUserDto: UpdateUserDto = { username: 'updated' };
      const updatedUser = { ...mockUser, ...updateUserDto };
      const mockSuccessResponse = new SuccessResponseDto('Updated', updatedUser);

      jest
        .spyOn(repository, 'getUserProfile')
        .mockResolvedValue(new SuccessResponseDto('Found', mockUser));
      (repository as any)._validateUniqueConstraints = jest
        .fn()
        .mockResolvedValue(undefined);
      (repository as any)._updateEntity = jest
        .fn()
        .mockResolvedValue(mockSuccessResponse);

      const result = await repository.updateUserProfile('1', updateUserDto);
      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data.username).toEqual('updated');
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate a user and return success response', async () => {
      jest
        .spyOn(repository, 'getUserProfile')
        .mockResolvedValue(new SuccessResponseDto('Found', mockUser));
      (repository as any)._softDelete = jest
        .fn()
        .mockResolvedValue(new SuccessResponseDto('Deleted', { id: '1' }));
      const result = await repository.deactivateUser('1');
      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data.id).toEqual('1');
    });
  });

  describe('searchUsers', () => {
    it('should search users and return a success response', async () => {
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockUser], meta: { total: 1 } };
      (repository as any)._findManyWithPagination = jest
        .fn()
        .mockResolvedValue(paginatedResult);
      const result = await repository.searchUsers('test', pagination);
      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(paginatedResult);
    });
  });

  describe('getAllUsers', () => {
    it('should get all users and return a success response', async () => {
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockUser], meta: { total: 1 } };
      (repository as any)._findManyWithPagination = jest
        .fn()
        .mockResolvedValue(paginatedResult);
      const result = await repository.getAllUsers(pagination);
      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(paginatedResult);
    });
  });
});
