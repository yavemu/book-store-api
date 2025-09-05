import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthHelper } from './auth-helper';

describe('Publishing Houses (e2e)', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  let createdPublishingHouseId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    authHelper = new AuthHelper(app);
    // Get admin token once
    await authHelper.getAdminToken();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /publishing-houses (Create Publishing House)', () => {
    it('should create a new publishing house', async () => {
      const createPublishingHouseDto = {
        name: 'E2E Test Publishing House ' + Date.now(),
        country: 'Test Country',
        websiteUrl: 'https://test-publisher.com'
      };

      const response = await authHelper.post('/publishing-houses').send(createPublishingHouseDto).expect(201);

      expect(response.body.data.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(createPublishingHouseDto.name);
      expect(response.body.data.country).toBe(createPublishingHouseDto.country);
      expect(response.body.data.websiteUrl).toBe(createPublishingHouseDto.websiteUrl);
      expect(response.body).toHaveProperty('createdAt');
      
      createdPublishingHouseId = response.body.data.id;
    });
  });

  describe('GET /publishing-houses/:id (Get Publishing House by ID)', () => {
    it('should get publishing house by ID', async () => {
      const response = await authHelper.get(`/api/publishing-houses/${createdPublishingHouseId}`).expect(200);

      expect(response.body.data.data).toHaveProperty('id', createdPublishingHouseId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('country');
      expect(response.body).toHaveProperty('websiteUrl');
      expect(response.body).toHaveProperty('createdAt');
    });
  });

  describe('PUT /publishing-houses/:id (Update Publishing House)', () => {
    it('should update publishing house', async () => {
      const updatePublishingHouseDto = {
        name: 'Updated E2E Publishing House ' + Date.now(),
        country: 'Updated Country',
        websiteUrl: 'https://updated-publisher.com'
      };

      const response = await authHelper.put(`/api/publishing-houses/${createdPublishingHouseId}`).send(updatePublishingHouseDto).expect(200);

      expect(response.body.data.data).toHaveProperty('id', createdPublishingHouseId);
      expect(response.body.data.name).toBe(updatePublishingHouseDto.name);
      expect(response.body.data.country).toBe(updatePublishingHouseDto.country);
      expect(response.body.data.websiteUrl).toBe(updatePublishingHouseDto.websiteUrl);
    });
  });

  describe('GET /publishing-houses (Get All Publishing Houses)', () => {
    it('should get all publishing houses with pagination', async () => {
      const response = await authHelper.get('/publishing-houses?page=1&limit=10').expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('POST /publishing-houses/search (Exact Search)', () => {
    it('should search publishing houses exactly', async () => {
      const searchDto = {
        name: 'Penguin'
      };

      const response = await authHelper.post('/publishing-houses/search?page=1&limit=10').send(searchDto).expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('GET /publishing-houses/filter (Simple Filter)', () => {
    it('should filter publishing houses with simple term', async () => {
      const response = await authHelper.get('/publishing-houses/filter?term=publisher&page=1&limit=10').expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('POST /publishing-houses/advanced-filter (Advanced Filter)', () => {
    it('should filter publishing houses with advanced filters', async () => {
      const filters = {
        name: 'House',
        country: 'United'
      };

      const response = await authHelper.post('/publishing-houses/advanced-filter?page=1&limit=10').send(filters).expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('GET /publishing-houses/export/csv (Export CSV)', () => {
    it('should export publishing houses to CSV', async () => {
      const response = await authHelper.get('/publishing-houses/export/csv').expect(200);

      expect(response.headers['content-type']).toMatch(/text\/csv/);
      expect(response.headers['content-disposition']).toMatch(/attachment/);
      expect(typeof response.text).toBe('string');
    });
  });

  describe('DELETE /publishing-houses/:id (Delete Publishing House)', () => {
    it('should soft delete publishing house', async () => {
      const response = await authHelper.delete(`/api/publishing-houses/${createdPublishingHouseId}`).expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/eliminado|deleted/i);
    });

    it('should not find deleted publishing house', async () => {
      await authHelper.get(`/api/publishing-houses/${createdPublishingHouseId}`).expect(404);
    });
  });
});