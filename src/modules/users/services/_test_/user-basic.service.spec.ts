import { Test, TestingModule } from '@nestjs/testing';
import { UserCrudService } from '../user-crud.service';
import { UserSearchService } from '../user-search.service';

describe('UserCrudService - Basic Tests', () => {
  let service: UserCrudService;

  beforeEach(async () => {
    const mockRepository = {
      registerUser: jest.fn().mockResolvedValue({}),
      getAllUsers: jest.fn().mockResolvedValue({ data: [], meta: {} }),
      getUserProfile: jest.fn().mockResolvedValue({}),
      updateUserProfile: jest.fn().mockResolvedValue({}),
      deactivateUser: jest.fn().mockResolvedValue({ id: 'test' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCrudService,
        {
          provide: 'IUserCrudRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserCrudService>(UserCrudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('UserSearchService - Basic Tests', () => {
  let service: UserSearchService;

  beforeEach(async () => {
    const mockRepository = {
      searchUsers: jest.fn().mockResolvedValue({ data: [], meta: {} }),
      findUsersWithFilters: jest.fn().mockResolvedValue({ data: [], meta: {} }),
      exportUsersToCsv: jest.fn().mockResolvedValue(''),
      findUserByEmail: jest.fn().mockResolvedValue(false),
      findUserToLoginByEmail: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSearchService,
        {
          provide: 'IUserSearchRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserSearchService>(UserSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});