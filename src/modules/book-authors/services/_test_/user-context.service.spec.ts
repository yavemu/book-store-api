import { Test, TestingModule } from '@nestjs/testing';
import { UserContextService } from '../user-context.service';

describe('BookAuthorsUserContextService', () => {
  let service: UserContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserContextService],
    }).compile();

    service = module.get<UserContextService>(UserContextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('extractUserId', () => {
    it('should extract user id from request', () => {
      const mockRequest = {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
        },
      };

      const result = service.extractUserId(mockRequest);
      expect(result).toBe('test-user-id');
    });

    it('should return empty string when user is not present', () => {
      const mockRequest = {};

      const result = service.extractUserId(mockRequest);
      expect(result).toBe('');
    });

    it('should return empty string when user.id is not present', () => {
      const mockRequest = {
        user: {
          email: 'test@example.com',
        },
      };

      const result = service.extractUserId(mockRequest);
      expect(result).toBe('');
    });

    it('should return empty string when request is null or undefined', () => {
      expect(service.extractUserId(null)).toBe('');
      expect(service.extractUserId(undefined)).toBe('');
    });

    it('should handle request with undefined user', () => {
      const mockRequest = {
        user: undefined,
      };

      const result = service.extractUserId(mockRequest);
      expect(result).toBe('');
    });

    it('should handle request with null user', () => {
      const mockRequest = {
        user: null,
      };

      const result = service.extractUserId(mockRequest);
      expect(result).toBe('');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user from request', () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
      };
      const mockRequest = {
        user: mockUser,
      };

      const result = service.getCurrentUser(mockRequest);
      expect(result).toEqual(mockUser);
    });

    it('should return default user object when user is not present', () => {
      const mockRequest = {};

      const result = service.getCurrentUser(mockRequest);
      expect(result).toEqual({ id: '' });
    });

    it('should return default user object when request is null or undefined', () => {
      expect(service.getCurrentUser(null)).toEqual({ id: '' });
      expect(service.getCurrentUser(undefined)).toEqual({ id: '' });
    });

    it('should handle request with undefined user', () => {
      const mockRequest = {
        user: undefined,
      };

      const result = service.getCurrentUser(mockRequest);
      expect(result).toEqual({ id: '' });
    });

    it('should handle request with null user', () => {
      const mockRequest = {
        user: null,
      };

      const result = service.getCurrentUser(mockRequest);
      expect(result).toEqual({ id: '' });
    });

    it('should return user with additional properties', () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        roles: ['user', 'admin'],
        permissions: ['read', 'write'],
      };
      const mockRequest = {
        user: mockUser,
      };

      const result = service.getCurrentUser(mockRequest);
      expect(result).toEqual(mockUser);
      expect(result.roles).toEqual(['user', 'admin']);
      expect(result.permissions).toEqual(['read', 'write']);
    });
  });
});
