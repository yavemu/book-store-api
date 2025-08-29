import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../../../common/strategies/jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue('test-secret'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    it('should return user object from JWT payload', async () => {
      const payload = {
        sub: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        role: 'user',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: payload.sub,
        username: payload.username,
        role: payload.role,
      });
    });
  });
});