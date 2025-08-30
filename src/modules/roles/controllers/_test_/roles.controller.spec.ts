import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from '../roles.controller';
import { IRoleCrudService } from '../../interfaces/role-crud.service.interface';
import { IRoleSearchService } from '../../interfaces/role-search.service.interface';
import { IUserContextService } from '../../interfaces/user-context.service.interface';
import { CreateRoleDto } from '../../dto/create-role.dto';
import { UpdateRoleDto } from '../../dto/update-role.dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

describe('RolesController', () => {
  let controller: RolesController;
  let crudService: IRoleCrudService;
  let searchService: IRoleSearchService;
  let userContextService: IUserContextService;

  const mockCrudService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockSearchService = {
    findActiveRoles: jest.fn(),
    searchRoles: jest.fn(),
    findRolesByPermission: jest.fn(),
    findByName: jest.fn(),
  };

  const mockUserContextService = {
    extractUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        { provide: 'IRoleCrudService', useValue: mockCrudService },
        { provide: 'IRoleSearchService', useValue: mockSearchService },
        { provide: 'IUserContextService', useValue: mockUserContextService },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    crudService = module.get<IRoleCrudService>('IRoleCrudService');
    searchService = module.get<IRoleSearchService>('IRoleSearchService');
    userContextService = module.get<IUserContextService>('IUserContextService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a role', async () => {
      const createDto = new CreateRoleDto();
      createDto.name = 'TEST_ROLE';
      createDto.description = 'Test role description';

      const req = { user: { id: 'user-1' } };
      const mockRole = {
        id: 'role-1',
        name: 'TEST_ROLE',
        description: 'Test role description',
      };

      mockUserContextService.extractUserId.mockReturnValue('user-1');
      mockCrudService.create.mockResolvedValue(mockRole);

      const result = await controller.create(createDto, req);

      expect(userContextService.extractUserId).toHaveBeenCalledWith(req);
      expect(crudService.create).toHaveBeenCalledWith(createDto, 'user-1');
      expect(result).toEqual(mockRole);
    });
  });

  describe('findAll', () => {
    it('should find all roles', async () => {
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;

      const mockRoles = {
        data: [{ id: 'role-1', name: 'ADMIN' }],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockCrudService.findAll.mockResolvedValue(mockRoles);

      const result = await controller.findAll(pagination);

      expect(crudService.findAll).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(mockRoles);
    });
  });

  describe('findActiveRoles', () => {
    it('should find active roles', async () => {
      const pagination = new PaginationDto();
      const mockActiveRoles = {
        data: [{ id: 'role-1', name: 'ADMIN', isActive: true }],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockSearchService.findActiveRoles.mockResolvedValue(mockActiveRoles);

      const result = await controller.findActiveRoles(pagination);

      expect(searchService.findActiveRoles).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(mockActiveRoles);
    });
  });

  describe('searchRoles', () => {
    it('should search roles by term', async () => {
      const term = 'admin';
      const pagination = new PaginationDto();
      const mockSearchResults = {
        data: [{ id: 'role-1', name: 'ADMIN' }],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockSearchService.searchRoles.mockResolvedValue(mockSearchResults);

      const result = await controller.searchRoles(term, pagination);

      expect(searchService.searchRoles).toHaveBeenCalledWith(term, pagination);
      expect(result).toEqual(mockSearchResults);
    });
  });

  describe('findRolesByPermission', () => {
    it('should find roles by permission', async () => {
      const permission = 'READ_BOOKS';
      const pagination = new PaginationDto();
      const mockRoles = {
        data: [{ id: 'role-1', name: 'USER', permissions: ['READ_BOOKS'] }],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockSearchService.findRolesByPermission.mockResolvedValue(mockRoles);

      const result = await controller.findRolesByPermission(permission, pagination);

      expect(searchService.findRolesByPermission).toHaveBeenCalledWith(permission, pagination);
      expect(result).toEqual(mockRoles);
    });
  });

  describe('findByName', () => {
    it('should find role by name', async () => {
      const name = 'ADMIN';
      const mockRole = { id: 'role-1', name: 'ADMIN' };

      mockSearchService.findByName.mockResolvedValue(mockRole);

      const result = await controller.findByName(name);

      expect(searchService.findByName).toHaveBeenCalledWith(name);
      expect(result).toEqual(mockRole);
    });
  });

  describe('findOne', () => {
    it('should find role by id', async () => {
      const id = 'role-1';
      const mockRole = { id: 'role-1', name: 'ADMIN' };

      mockCrudService.findOne.mockResolvedValue(mockRole);

      const result = await controller.findOne(id);

      expect(crudService.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockRole);
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const id = 'role-1';
      const updateDto = new UpdateRoleDto();
      updateDto.description = 'Updated description';

      const req = { user: { id: 'user-1' } };
      const mockUpdatedRole = {
        id: 'role-1',
        name: 'ADMIN',
        description: 'Updated description',
      };

      mockUserContextService.extractUserId.mockReturnValue('user-1');
      mockCrudService.update.mockResolvedValue(mockUpdatedRole);

      const result = await controller.update(id, updateDto, req);

      expect(userContextService.extractUserId).toHaveBeenCalledWith(req);
      expect(crudService.update).toHaveBeenCalledWith(id, updateDto, 'user-1');
      expect(result).toEqual(mockUpdatedRole);
    });
  });

  describe('remove', () => {
    it('should remove a role', async () => {
      const id = 'role-1';
      const req = { user: { id: 'user-1' } };
      const mockResult = { message: 'Role deleted successfully' };

      mockUserContextService.extractUserId.mockReturnValue('user-1');
      mockCrudService.remove.mockResolvedValue(mockResult);

      const result = await controller.remove(id, req);

      expect(userContextService.extractUserId).toHaveBeenCalledWith(req);
      expect(crudService.remove).toHaveBeenCalledWith(id, 'user-1');
      expect(result).toEqual(mockResult);
    });
  });
});
