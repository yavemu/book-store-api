import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto';
import { RegisterUserDto } from '../../users/dto/register-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

const mockUser: User = {
    id: '1',
    username: 'test',
    email: 'test@test.com',
} as User;

describe('AuthController', () => {
    let controller: AuthController;
    let service: AuthService;

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
        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('login', () => {
        it('should login a user', async () => {
            const loginDto: LoginDto = { email: 'test@test.com', password: 'password' };
            mockAuthService.validateUser.mockResolvedValue(mockUser);
            mockAuthService.login.mockResolvedValue({ access_token: 'token' });
            const result = await controller.login(loginDto);
            expect(result).toEqual({ access_token: 'token' });
        });

        it('should throw unauthorized exception if user is not valid', async () => {
            const loginDto: LoginDto = { email: 'test@test.com', password: 'password' };
            mockAuthService.validateUser.mockResolvedValue(null);
            await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('register', () => {
        it('should register a user', async () => {
            const registerUserDto: RegisterUserDto = {} as any;
            await controller.register(registerUserDto);
            expect(service.register).toHaveBeenCalledWith(registerUserDto);
        });
    });

    describe('getProfile', () => {
        it('should get a user profile', async () => {
            const req = { user: { userId: '1' } };
            await controller.getProfile(req);
            expect(service.getProfile).toHaveBeenCalledWith('1');
        });
    });
});
