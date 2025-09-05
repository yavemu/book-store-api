import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthHelper } from './auth-helper';

describe('Book Genres (e2e)', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  let createdGenreId: string;

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

  describe('POST /genres (Create Book Genre)', () => {
    it('should create a new book genre', async () => {
      const createGenreDto = {
        name: 'E2E Test Genre ' + Date.now(),
        description: 'This is a test genre created during E2E testing'
      };

      const response = await authHelper.post('/genres').send(createGenreDto).expect(201);

      expect(response.body.data.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(createGenreDto.name);
      expect(response.body.data.description).toBe(createGenreDto.description);
      expect(response.body).toHaveProperty('createdAt');
      
      createdGenreId = response.body.data.id;
    });
  });

  describe('GET /genres/:id (Get Genre by ID)', () => {
    it('should get book genre by ID', async () => {
      const response = await authHelper.get(`/api/genres/${createdGenreId}`).expect(200);

      expect(response.body.data.data).toHaveProperty('id', createdGenreId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('createdAt');
    });
  });

  describe('PUT /genres/:id (Update Genre)', () => {
    it('should update book genre', async () => {
      const updateGenreDto = {
        name: 'Updated E2E Genre ' + Date.now(),
        description: 'This is an updated test genre description'
      };

      const response = await authHelper.put(`/api/genres/${createdGenreId}`).send(updateGenreDto).expect(200);

      expect(response.body.data.data).toHaveProperty('id', createdGenreId);
      expect(response.body.data.name).toBe(updateGenreDto.name);
      expect(response.body.data.description).toBe(updateGenreDto.description);
    });
  });

  describe('GET /genres (Get All Genres)', () => {
    it('should get all book genres with pagination', async () => {
      const response = await authHelper.get('/genres?page=1&limit=10').expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('POST /genres/search (Exact Search)', () => {
    it('should search book genres exactly', async () => {
      const searchDto = {
        name: 'Fiction'
      };

      const response = await authHelper.post('/genres/search?page=1&limit=10').send(searchDto).expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('GET /genres/filter (Simple Filter)', () => {
    it('should filter book genres with simple term', async () => {
      const response = await authHelper.get('/genres/filter?term=fiction&page=1&limit=10').expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('POST /genres/advanced-filter (Advanced Filter)', () => {
    it('should filter book genres with advanced filters', async () => {
      const filters = {
        name: 'Fiction',
        description: 'genre'
      };

      const response = await authHelper.post('/genres/advanced-filter?page=1&limit=10').send(filters).expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('GET /genres/export/csv (Export CSV)', () => {
    it('should export book genres to CSV', async () => {
      const response = await authHelper.get('/genres/export/csv').expect(200);

      expect(response.headers['content-type']).toMatch(/text\/csv/);
      expect(response.headers['content-disposition']).toMatch(/attachment/);
      expect(typeof response.text).toBe('string');
    });
  });

  describe('DELETE /genres/:id (Delete Genre)', () => {
    it('should soft delete book genre', async () => {
      const response = await authHelper.delete(`/api/genres/${createdGenreId}`).expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/eliminado|deleted/i);
    });

    it('should not find deleted genre', async () => {
      await authHelper.get(`/api/genres/${createdGenreId}`).expect(404);
    });
  });
});