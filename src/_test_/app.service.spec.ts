import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return health status with correct structure', () => {
      const result = service.getHealth();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
    });

    it('should return status as "ok"', () => {
      const result = service.getHealth();
      expect(result.status).toBe('ok');
    });

    it('should return timestamp as ISO string', () => {
      const result = service.getHealth();
      expect(typeof result.timestamp).toBe('string');
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });

    it('should return uptime as a number', () => {
      const result = service.getHealth();
      expect(typeof result.uptime).toBe('number');
      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should return process uptime', () => {
      const mockUptime = 456.789;
      jest.spyOn(process, 'uptime').mockReturnValue(mockUptime);

      const result = service.getHealth();
      expect(result.uptime).toBe(mockUptime);
    });

    it('should return current timestamp', () => {
      const mockDate = new Date('2024-01-01T00:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const result = service.getHealth();
      expect(result.timestamp).toBe('2024-01-01T00:00:00.000Z');
    });
  });
});