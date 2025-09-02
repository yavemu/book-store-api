import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../services/auth.service';
import { LoginDto } from '../../dto';
import { RegisterUserDto } from '../../../users/dto/register-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;

  const mockLoginResponse = {
    access_token: 'jwt-token-123',
    user: {
      id: 'user-123',
      username: 'testuser',
      email: 'test@example.com',
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
    },
    message: 'Login successful',
  };

  const mockRegisterResponse = {
    message: 'User registered successfully',
    user: {
      id: 'user-123',
      username: 'testuser',
      email: 'test@example.com',
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
    },
  };

  const mockProfileResponse = {
    data: {
      id: 'user-123',
      username: 'testuser',
      email: 'test@example.com',
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
    },
    message: 'Profile fetched successfully',
  };

  const loginDto: LoginDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  const registerDto: RegisterUserDto = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    roleId: 'role-123',
  };

  const mockRequest = {
    ip: '192.168.1.1',
    connection: { remoteAddress: '192.168.1.1' },
    headers: { 'x-forwarded-for': '192.168.1.1' },
    user: {
      userId: 'user-123',
    },
  };

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
      getProfile: jest.fn(),
      validateUser: jest.fn(),
      generateToken: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login()', () => {
    it('should login successfully with valid credentials', async () => {
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(loginDto, mockRequest);

      expect(result).toEqual(mockLoginResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
        '192.168.1.1',
      );
    });

    it('should handle login with IP from connection', async () => {
      const requestWithConnection = {
        connection: { remoteAddress: '10.0.0.1' },
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      await controller.login(loginDto, requestWithConnection);

      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
        '10.0.0.1',
      );
    });

    it('should handle login with IP from x-forwarded-for header', async () => {
      const requestWithHeader = {
        headers: { 'x-forwarded-for': '203.0.113.1' },
      };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      await controller.login(loginDto, requestWithHeader);

      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
        '203.0.113.1',
      );
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      const error = new UnauthorizedException('Invalid credentials');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto, mockRequest)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
        '192.168.1.1',
      );
    });

    it('should handle login with invalid email format', async () => {
      const invalidLoginDto = { ...loginDto, email: 'invalid-email' };
      const error = new UnauthorizedException('Invalid email format');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(invalidLoginDto, mockRequest)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should handle login with empty password', async () => {
      const invalidLoginDto = { ...loginDto, password: '' };
      const error = new UnauthorizedException('Password is required');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(invalidLoginDto, mockRequest)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register()', () => {
    it('should register successfully with valid data', async () => {
      mockAuthService.register.mockResolvedValue(mockRegisterResponse);

      const result = await controller.register(registerDto, mockRequest);

      expect(result).toEqual(mockRegisterResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto, '192.168.1.1');
    });

    it('should handle registration with IP from connection', async () => {
      const requestWithConnection = {
        connection: { remoteAddress: '10.0.0.1' },
      };
      mockAuthService.register.mockResolvedValue(mockRegisterResponse);

      await controller.register(registerDto, requestWithConnection);

      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto, '10.0.0.1');
    });

    it('should handle registration with IP from x-forwarded-for header', async () => {
      const requestWithHeader = {
        headers: { 'x-forwarded-for': '203.0.113.1' },
      };
      mockAuthService.register.mockResolvedValue(mockRegisterResponse);

      await controller.register(registerDto, requestWithHeader);

      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto, '203.0.113.1');
    });

    it('should handle registration errors', async () => {
      const error = new Error('User already exists');
      mockAuthService.register.mockRejectedValue(error);

      await expect(controller.register(registerDto, mockRequest)).rejects.toThrow(
        'User already exists',
      );
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto, '192.168.1.1');
    });

    it('should handle registration with duplicate email', async () => {
      const error = new Error('Email already registered');
      mockAuthService.register.mockRejectedValue(error);

      await expect(controller.register(registerDto, mockRequest)).rejects.toThrow(
        'Email already registered',
      );
    });

    it('should handle registration with duplicate username', async () => {
      const error = new Error('Username already exists');
      mockAuthService.register.mockRejectedValue(error);

      await expect(controller.register(registerDto, mockRequest)).rejects.toThrow(
        'Username already exists',
      );
    });
  });

  describe('getProfile()', () => {
    it('should return user profile successfully', async () => {
      mockAuthService.getProfile.mockResolvedValue(mockProfileResponse);

      const result = await controller.getProfile(mockRequest);

      expect(result).toEqual(mockProfileResponse);
      expect(mockAuthService.getProfile).toHaveBeenCalledWith('user-123');
    });

    it('should handle profile retrieval errors', async () => {
      const error = new Error('User not found');
      mockAuthService.getProfile.mockRejectedValue(error);

      await expect(controller.getProfile(mockRequest)).rejects.toThrow('User not found');
      expect(mockAuthService.getProfile).toHaveBeenCalledWith('user-123');
    });

    it('should handle missing user in request', async () => {
      const requestWithoutUser = {};
      
      await expect(controller.getProfile(requestWithoutUser)).rejects.toThrow();
    });

    it('should handle profile with admin role', async () => {
      const adminProfileResponse = {
        data: {
          ...mockProfileResponse.data,
          role: {
            id: 'admin-role-123',
            name: 'admin',
            description: 'Administrator role',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            users: [],
            normalizeRoleName: jest.fn(),
          },
        },
        message: mockProfileResponse.message,
      };
      
      mockAuthService.getProfile.mockResolvedValue(adminProfileResponse);
      const requestWithAdminUser = {
        user: {
          userId: 'admin-123',
        },
      };

      const result = await controller.getProfile(requestWithAdminUser);

      expect(result).toEqual(adminProfileResponse);
      expect(result.data.role.name).toBe('admin');
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete authentication flow', async () => {
      // Register
      mockAuthService.register.mockResolvedValue(mockRegisterResponse);
      const registerResult = await controller.register(registerDto, mockRequest);
      expect(registerResult).toEqual(mockRegisterResponse);

      // Login
      mockAuthService.login.mockResolvedValue(mockLoginResponse);
      const loginResult = await controller.login(loginDto, mockRequest);
      expect(loginResult).toEqual(mockLoginResponse);

      // Get Profile
      mockAuthService.getProfile.mockResolvedValue(mockProfileResponse);
      const profileResult = await controller.getProfile(mockRequest);
      expect(profileResult).toEqual(mockProfileResponse);

      expect(mockAuthService.register).toHaveBeenCalledTimes(1);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
      expect(mockAuthService.getProfile).toHaveBeenCalledTimes(1);
    });

    it('should handle concurrent login attempts', async () => {
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const promises = [
        controller.login(loginDto, mockRequest),
        controller.login(loginDto, mockRequest),
        controller.login(loginDto, mockRequest),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toEqual(mockLoginResponse);
      });
      expect(mockAuthService.login).toHaveBeenCalledTimes(3);
    });

    it('should handle mixed success and failure scenarios', async () => {
      // Successful registration
      mockAuthService.register.mockResolvedValue(mockRegisterResponse);
      const registerResult = await controller.register(registerDto, mockRequest);
      expect(registerResult).toEqual(mockRegisterResponse);

      // Failed login with wrong password
      const wrongPasswordDto = { ...loginDto, password: 'wrongpassword' };
      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));
      
      await expect(controller.login(wrongPasswordDto, mockRequest)).rejects.toThrow(
        UnauthorizedException,
      );

      // Successful login with correct password
      mockAuthService.login.mockResolvedValue(mockLoginResponse);
      const loginResult = await controller.login(loginDto, mockRequest);
      expect(loginResult).toEqual(mockLoginResponse);
    });

    it('should handle requests without IP information', async () => {
      const requestWithoutIp = { headers: {} };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      await controller.login(loginDto, requestWithoutIp);

      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
        undefined,
      );
    });
  });
});