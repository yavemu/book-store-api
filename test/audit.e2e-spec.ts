import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthHelper } from './auth-helper';

describe('Audit (e2e)', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  let testAuditId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    authHelper = new AuthHelper(app);

    // Create some audit data by performing an action (creating a genre)
    await authHelper.post('/genres')
      .send({
        name: 'E2E Audit Test Genre ' + Date.now(),
        description: 'Test genre for audit E2E tests'
      });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /audit (Get All Audit Logs)', () => {
    it('should get all audit logs with pagination', async () => {
      const response = await authHelper.get('/audit?page=1&limit=10').expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(Array.isArray(response.body.data.data)).toBe(true);

      // Save first audit entry ID for later tests
      if (response.body.data.length > 0) {
        testAuditId = response.body.data[0].id;
      }
    });
  });

  describe('GET /audit/:id (Get Audit by ID)', () => {
    it('should get audit log by ID', async () => {
      if (!testAuditId) {
        // Skip if no audit ID available
        return;
      }

      const response = await authHelper.get(`/api/audit/${testAuditId}`).expect(200);

      expect(response.body.data.data).toHaveProperty('id', testAuditId);
      expect(response.body).toHaveProperty('performedBy');
      expect(response.body).toHaveProperty('action');
      expect(response.body).toHaveProperty('details');
      expect(response.body).toHaveProperty('entityType');
      expect(response.body).toHaveProperty('result');
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should return 404 for non-existent audit ID', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      
      await authHelper.get(`/api/audit/${nonExistentId}`).expect(404);
    });
  });

  describe('POST /audit/search (Exact Search)', () => {
    it('should search audit logs exactly', async () => {
      const searchDto = {
        action: 'CREATE',
        result: 'SUCCESS'
      };

      const response = await authHelper.post('/audit/search?page=1&limit=10').send(searchDto).expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('GET /audit/filter (Simple Filter)', () => {
    it('should filter audit logs with simple term', async () => {
      const response = await authHelper.get('/audit/filter?term=CREATE&page=1&limit=10').expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });

    it('should return 400 when filter term is missing', async () => {
      await authHelper.get('/audit/filter?page=1&limit=10').expect(400);
    });
  });

  describe('POST /audit/advanced-filter (Advanced Filter)', () => {
    it('should filter audit logs with advanced filters', async () => {
      const filters = {
        action: 'CREATE',
        entityType: 'BookGenre',
        result: 'SUCCESS'
      };

      const response = await authHelper.post('/audit/advanced-filter?page=1&limit=10').send(filters).expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });

    it('should handle date range filters', async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const filters = {
        dateRange: {
          startDate: yesterday.toISOString().split('T')[0],
          endDate: tomorrow.toISOString().split('T')[0]
        }
      };

      const response = await authHelper.post('/audit/advanced-filter?page=1&limit=10').send(filters).expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('GET /audit/export/csv (Export CSV)', () => {
    it('should export audit logs to CSV', async () => {
      const response = await authHelper.get('/audit/export/csv').expect(200);

      expect(response.headers['content-type']).toMatch(/text\/csv/);
      expect(response.headers['content-disposition']).toMatch(/attachment/);
      expect(typeof response.text).toBe('string');
    });

    it('should export audit logs to CSV with filters', async () => {
      const response = await authHelper.get('/audit/export/csv?action=CREATE&result=SUCCESS').expect(200);

      expect(response.headers['content-type']).toMatch(/text\/csv/);
      expect(response.headers['content-disposition']).toMatch(/attachment/);
      expect(typeof response.text).toBe('string');
    });
  });

  describe('Audit Trail Generation', () => {
    it('should generate audit logs for CRUD operations', async () => {
      // Create a genre to generate CREATE audit
      const createResponse = await authHelper.post('/genres')
        .send({
          name: 'Audit Trail Test ' + Date.now(),
          description: 'Testing audit trail generation'
        });

      const genreId = createResponse.body.id;

      // Update the genre to generate UPDATE audit
      await authHelper.put(`/api/genres/${genreId}`)
        .send({
          name: 'Updated Audit Trail Test ' + Date.now(),
          description: 'Updated description for audit trail testing'
        });

      // Check that audit logs were created
      const auditResponse = await authHelper.get('/audit?page=1&limit=20').expect(200);

      expect(auditResponse.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: 'CREATE',
            entityType: 'BookGenre',
            result: 'SUCCESS'
          })
        ])
      );

      expect(auditResponse.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: 'UPDATE',
            entityType: 'BookGenre', 
            result: 'SUCCESS'
          })
        ])
      );

      // Delete the genre to generate DELETE audit
      await authHelper.delete(`/api/genres/${genreId}`).expect(200);

      // Verify DELETE audit was created
      const finalAuditResponse = await authHelper.get('/audit?page=1&limit=20').expect(200);

      expect(finalAuditResponse.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: 'DELETE',
            entityType: 'BookGenre',
            result: 'SUCCESS'
          })
        ])
      );
    });
  });
});