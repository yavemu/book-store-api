import { Test, TestingModule } from '@nestjs/testing';
import { RoleCrudService } from '../role-crud.service';
import { RoleSearchService } from '../role-search.service';

describe('RoleCrudService - Basic Tests', () => {
  let service: RoleCrudService;

  beforeEach(async () => {
    const mockRoles = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'admin',
        description: 'Administrator role',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        users: [],
        normalizeRoleName: jest.fn(),
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'user',
        description: 'Standard user role',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        users: [],
        normalizeRoleName: jest.fn(),
      },
    ];

    const mockRepository = {
      create: jest.fn().mockResolvedValue({}),
      findAll: jest.fn().mockResolvedValue({ data: [], meta: {} }),
      findOne: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      remove: jest.fn().mockResolvedValue(undefined),
      findForSelect: jest.fn().mockResolvedValue(mockRoles),
    };

    const mockValidationService = {
      validateUniqueConstraints: jest.fn().mockResolvedValue(undefined),
    };

    const mockErrorHandler = {
      handleError: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleCrudService,
        {
          provide: 'IRoleCrudRepository',
          useValue: mockRepository,
        },
        {
          provide: 'IValidationService',
          useValue: mockValidationService,
        },
        {
          provide: 'IErrorHandlerService',
          useValue: mockErrorHandler,
        },
      ],
    }).compile();

    service = module.get<RoleCrudService>(RoleCrudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('RoleSearchService - Basic Tests', () => {
  let service: RoleSearchService;

  beforeEach(async () => {
    const mockRepository = {
      search: jest.fn().mockResolvedValue({ data: [], meta: {} }),
      filter: jest.fn().mockResolvedValue({ data: [], meta: {} }),
      export: jest.fn().mockResolvedValue(''),
    };

    const mockErrorHandler = {
      handleError: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleSearchService,
        {
          provide: 'IRoleSearchRepository',
          useValue: mockRepository,
        },
        {
          provide: 'IErrorHandlerService',
          useValue: mockErrorHandler,
        },
      ],
    }).compile();

    service = module.get<RoleSearchService>(RoleSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
