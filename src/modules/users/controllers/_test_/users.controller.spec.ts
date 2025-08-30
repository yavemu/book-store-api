import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { UsersController } from '../users.controller';
import { IUserCrudService } from '../../interfaces/user-crud.service.interface';
import { IUserSearchService } from '../../interfaces/user-search.service.interface';
import { CreateUserDto, UpdateUserDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { UserRole } from '../../enums/user-role.enum';

describe('UsersController', () => {
  let controller: UsersController;
  let crudService: IUserCrudService;
  let searchService: IUserSearchService;

  const mockCrudService = {
    create: jest.fn(),
    register: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockSearchService = {
    search: jest.fn(),
    findWithFilters: jest.fn(),
    exportToCsv: jest.fn(),
    findByEmail: jest.fn(),
    findToLoginByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: 'IUserCrudService', useValue: mockCrudService },
        { provide: 'IUserSearchService', useValue: mockSearchService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    crudService = module.get<IUserCrudService>('IUserCrudService');
    searchService = module.get<IUserSearchService>('IUserSearchService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createDto = new CreateUserDto();
      const req = { user: { userId: 'admin-user-1' } };

      await controller.create(createDto, req);

      expect(crudService.create).toHaveBeenCalledWith(createDto, 'admin-user-1');
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const pagination = new PaginationDto();

      await controller.findAll(pagination);

      expect(crudService.findAll).toHaveBeenCalledWith(pagination);
    });
  });

  describe('findOne', () => {
    it('should find a user by id when user is admin', async () => {
      const id = '1';
      const req = { user: { userId: 'admin-user-1', role: UserRole.ADMIN } };

      await controller.findOne(id, req);

      expect(crudService.findById).toHaveBeenCalledWith(id);
    });

    it('should find a user by id when user views own profile', async () => {
      const id = 'user-1';
      const req = { user: { userId: 'user-1', role: UserRole.USER } };

      await controller.findOne(id, req);

      expect(crudService.findById).toHaveBeenCalledWith(id);
    });

    it('should throw ForbiddenException when non-admin user tries to view other profile', async () => {
      const id = 'user-2';
      const req = { user: { userId: 'user-1', role: UserRole.USER } };

      await expect(controller.findOne(id, req)).rejects.toThrow(ForbiddenException);
      expect(crudService.findById).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user when user is admin', async () => {
      const id = '1';
      const updateDto = new UpdateUserDto();
      const req = { user: { userId: 'admin-user-1', role: UserRole.ADMIN } };

      await controller.update(id, updateDto, req);

      expect(crudService.update).toHaveBeenCalledWith(id, updateDto, 'admin-user-1');
    });

    it('should update a user when user updates own profile', async () => {
      const id = 'user-1';
      const updateDto = new UpdateUserDto();
      const req = { user: { userId: 'user-1', role: UserRole.USER } };

      await controller.update(id, updateDto, req);

      expect(crudService.update).toHaveBeenCalledWith(id, updateDto, 'user-1');
    });

    it('should throw ForbiddenException when non-admin user tries to update other profile', async () => {
      const id = 'user-2';
      const updateDto = new UpdateUserDto();
      const req = { user: { userId: 'user-1', role: UserRole.USER } };

      await expect(controller.update(id, updateDto, req)).rejects.toThrow(ForbiddenException);
      expect(crudService.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const id = '1';
      const req = { user: { userId: 'admin-user-1' } };

      await controller.remove(id, req);

      expect(crudService.softDelete).toHaveBeenCalledWith(id, 'admin-user-1');
    });
  });
});
