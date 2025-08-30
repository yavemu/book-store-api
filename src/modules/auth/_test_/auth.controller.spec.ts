import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from '../auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto';
import { RegisterUserDto } from '../../users/dto/register-user.dto';
import { ERROR_MESSAGES } from '../../../common/constants';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
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
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginDto = new LoginDto();
      loginDto.email = 'test@example.com';
      loginDto.password = 'password123';

      const mockUser = { id: 'user-1', email: 'test@example.com' };
      const mockLoginResponse = {
        access_token: 'jwt-token',
        user: mockUser,
      };

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const mockReq = { ip: '127.0.0.1' };
      const result = await controller.login(loginDto, mockReq);

      expect(authService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
        '127.0.0.1',
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = new LoginDto();
      loginDto.email = 'test@example.com';
      loginDto.password = 'wrongpassword';

      mockAuthService.validateUser.mockResolvedValue(null);

      const mockReq = { ip: '127.0.0.1' };
      await expect(controller.login(loginDto, mockReq)).rejects.toThrow(
        new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS),
      );

      expect(authService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
        '127.0.0.1',
      );
      expect(authService.login).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = new RegisterUserDto();
      registerDto.email = 'newuser@example.com';
      registerDto.password = 'password123';
      registerDto.username = 'john_doe';

      const mockRegisteredUser = {
        id: 'user-2',
        email: 'newuser@example.com',
        username: 'john_doe',
      };

      mockAuthService.register.mockResolvedValue(mockRegisteredUser);

      const mockReq = { ip: '127.0.0.1' };
      const result = await controller.register(registerDto, mockReq);

      expect(authService.register).toHaveBeenCalledWith(registerDto, '127.0.0.1');
      expect(result).toEqual(mockRegisteredUser);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockProfile = {
        id: 'user-1',
        email: 'test@example.com',
        username: 'test_user',
      };

      const req = { user: { userId: 'user-1' } };

      mockAuthService.getProfile.mockResolvedValue(mockProfile);

      const result = await controller.getProfile(req);

      expect(authService.getProfile).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockProfile);
    });
  });
});
