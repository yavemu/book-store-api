import { Test, TestingModule } from '@nestjs/testing';
import { UserCrudService } from '../user-crud.service';
import { IUserCrudRepository } from '../../interfaces/user-crud.repository.interface';
import { CreateUserDto, UpdateUserDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { User } from '../../entities/user.entity';

describe('UserCrudService', () => {
  let service: UserCrudService;
  let crudRepository: IUserCrudRepository;

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

  const mockCrudRepository = {
    registerUser: jest.fn(),
    getAllUsers: jest.fn(),
    getUserProfile: jest.fn(),
    updateUserProfile: jest.fn(),
    deactivateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCrudService,
        { provide: 'IUserCrudRepository', useValue: mockCrudRepository },
      ],
    }).compile();

    service = module.get<UserCrudService>(UserCrudService);
    crudRepository = module.get<IUserCrudRepository>('IUserCrudRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createDto = new CreateUserDto();
      const performedBy = 'admin-user-1';
      mockCrudRepository.registerUser.mockResolvedValue(mockUser as User);

      const result = await service.create(createDto, performedBy);

      expect(crudRepository.registerUser).toHaveBeenCalledWith(createDto, performedBy);
      expect(result).toEqual(mockUser);
    });
  });

  describe('register', () => {
    it('should register a user', async () => {
      const registerDto = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      };
      const performedBy = 'system';
      mockCrudRepository.registerUser.mockResolvedValue(mockUser as User);

      const result = await service.register(registerDto, performedBy);

      expect(crudRepository.registerUser).toHaveBeenCalledWith(registerDto, performedBy);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockUser], meta: { total: 1, page: 1, limit: 10 } };
      mockCrudRepository.getAllUsers.mockResolvedValue(paginatedResult);

      const result = await service.findAll(pagination);

      expect(crudRepository.getAllUsers).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const id = '1';
      mockCrudRepository.getUserProfile.mockResolvedValue(mockUser as User);

      const result = await service.findById(id);

      expect(crudRepository.getUserProfile).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = '1';
      const updateDto = new UpdateUserDto();
      const performedBy = 'admin-user-1';
      const updatedUser = { ...mockUser, ...updateDto };
      mockCrudRepository.updateUserProfile.mockResolvedValue(updatedUser);

      const result = await service.update(id, updateDto, performedBy);

      expect(crudRepository.updateUserProfile).toHaveBeenCalledWith(id, updateDto, performedBy);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('softDelete', () => {
    it('should soft delete a user', async () => {
      const id = '1';
      const performedBy = 'admin-user-1';
      const deleteResult = { id: '1' };
      mockCrudRepository.deactivateUser.mockResolvedValue(deleteResult);

      const result = await service.softDelete(id, performedBy);

      expect(crudRepository.deactivateUser).toHaveBeenCalledWith(id, performedBy);
      expect(result).toEqual(deleteResult);
    });
  });
});