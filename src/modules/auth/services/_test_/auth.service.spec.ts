import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { IUserCrudService } from '../../../users/interfaces/user-crud.service.interface';
import { IUserSearchService } from '../../../users/interfaces/user-search.service.interface';
import { IUserAuthService } from '../../../users/interfaces/user-auth.service.interface';
import { User } from '../../../users/entities/user.entity';
import { RegisterUserDto } from '../../../users/dto/register-user.dto';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let userCrudService: IUserCrudService;
  let userSearchService: IUserSearchService;
  let userAuthService: IUserAuthService;
  let jwtService: JwtService;

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
      users: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    } as any,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockUserCrudService = {
    register: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockUserSearchService = {
    findToLoginByEmail: jest.fn(),
    findByUsername: jest.fn(),
    findByEmail: jest.fn(),
    searchUsers: jest.fn(),
    findActiveUsers: jest.fn(),
    findUsersByRole: jest.fn(),
  };

  const mockUserAuthService = {
    logLogin: jest.fn(),
    logLogout: jest.fn(),
    validateCredentials: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: 'IUserCrudService', useValue: mockUserCrudService },
        { provide: 'IUserSearchService', useValue: mockUserSearchService },
        { provide: 'IUserAuthService', useValue: mockUserAuthService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userCrudService = module.get<IUserCrudService>('IUserCrudService');
    userSearchService = module.get<IUserSearchService>('IUserSearchService');
    userAuthService = module.get<IUserAuthService>('IUserAuthService');
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user with correct credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      
      mockUserSearchService.findToLoginByEmail.mockResolvedValue(mockUser as User);
      mockBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validateUser(email, password);

      expect(userSearchService.findToLoginByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(result).toEqual(mockUser);
    });

    it('should return null for invalid credentials', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      
      mockUserSearchService.findToLoginByEmail.mockResolvedValue(mockUser as User);
      mockBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.validateUser(email, password);

      expect(userSearchService.findToLoginByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(result).toBeNull();
    });

    it('should return null when user not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';
      
      mockUserSearchService.findToLoginByEmail.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(userSearchService.findToLoginByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle errors during user validation', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const error = new Error('Database connection failed');
      
      mockUserSearchService.findToLoginByEmail.mockRejectedValue(error);

      await expect(service.validateUser(email, password)).rejects.toThrow(error);
    });
  });

  describe('login', () => {
    it('should login user and return access token', async () => {
      const mockToken = 'mock-jwt-token';
      mockUserAuthService.logLogin.mockResolvedValue(undefined);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockUser as User);

      expect(userAuthService.logLogin).toHaveBeenCalledWith(mockUser.id);
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
        role: mockUser.role,
      });
      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    });

    it('should handle errors during login logging', async () => {
      const error = new Error('Audit service failed');
      mockUserAuthService.logLogin.mockRejectedValue(error);

      await expect(service.login(mockUser as User)).rejects.toThrow(error);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerUserDto: RegisterUserDto = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        roleId: 'role-1',
      };
      
      mockUserCrudService.register.mockResolvedValue(mockUser as User);

      const result = await service.register(registerUserDto);

      expect(userCrudService.register).toHaveBeenCalledWith(registerUserDto);
      expect(result).toEqual({
        message: 'Usuario creado exitosamente',
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    });

    it('should handle registration errors', async () => {
      const registerUserDto: RegisterUserDto = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      };
      const error = new Error('Email already exists');
      
      mockUserCrudService.register.mockRejectedValue(error);

      await expect(service.register(registerUserDto)).rejects.toThrow(error);
    });
  });

  describe('getProfile', () => {
    it('should get user profile by id', async () => {
      const userId = '1';
      
      mockUserCrudService.findById.mockResolvedValue(mockUser as User);

      const result = await service.getProfile(userId);

      expect(userCrudService.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('should handle errors when getting profile', async () => {
      const userId = '1';
      const error = new Error('User not found');
      
      mockUserCrudService.findById.mockRejectedValue(error);

      await expect(service.getProfile(userId)).rejects.toThrow(error);
    });
  });

  describe('error scenarios', () => {
    it('should handle JWT service errors during login', async () => {
      const error = new Error('JWT signing failed');
      mockUserAuthService.logLogin.mockResolvedValue(undefined);
      mockJwtService.sign.mockImplementation(() => {
        throw error;
      });

      await expect(service.login(mockUser as User)).rejects.toThrow(error);
    });

    it('should handle bcrypt comparison errors', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const error = new Error('Bcrypt comparison failed');
      
      mockUserSearchService.findToLoginByEmail.mockResolvedValue(mockUser as User);
      mockBcrypt.compare.mockRejectedValue(error as never);

      await expect(service.validateUser(email, password)).rejects.toThrow(error);
    });
  });
});