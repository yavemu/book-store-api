import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthHelper } from './auth-helper';

describe('Book Authors (e2e)', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  let createdAuthorId: string;

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

  describe('POST /book-authors (Create Book Author)', () => {
    it('should create a new book author', async () => {
      const createAuthorDto = {
        firstName: 'Test Author ' + Date.now(),
        lastName: 'E2E Lastname',
        nationality: 'Test Nationality',
        birthDate: '1970-01-01',
        biography: 'This is a test author created during E2E testing'
      };

      const response = await authHelper.post('/book-authors').send(createAuthorDto).expect(201);

      expect(response.body.data.data).toHaveProperty('id');
      expect(response.body.data.firstName).toBe(createAuthorDto.firstName);
      expect(response.body.data.lastName).toBe(createAuthorDto.lastName);
      expect(response.body.data.nationality).toBe(createAuthorDto.nationality);
      expect(response.body.data.biography).toBe(createAuthorDto.biography);
      expect(response.body).toHaveProperty('createdAt');
      
      createdAuthorId = response.body.data.id;
    });
  });

  describe('GET /book-authors/:id (Get Author by ID)', () => {
    it('should get book author by ID', async () => {
      const response = await authHelper.get(`/api/book-authors/${createdAuthorId}`).expect(200);

      expect(response.body.data.data).toHaveProperty('id', createdAuthorId);
      expect(response.body).toHaveProperty('firstName');
      expect(response.body).toHaveProperty('lastName');
      expect(response.body).toHaveProperty('nationality');
      expect(response.body).toHaveProperty('biography');
      expect(response.body).toHaveProperty('createdAt');
    });
  });

  describe('PUT /book-authors/:id (Update Author)', () => {
    it('should update book author', async () => {
      const updateAuthorDto = {
        firstName: 'Updated Author ' + Date.now(),
        lastName: 'Updated Lastname',
        nationality: 'Updated Nationality',
        biography: 'This is an updated author biography'
      };

      const response = await authHelper.put(`/api/book-authors/${createdAuthorId}`).send(updateAuthorDto).expect(200);

      expect(response.body.data.data).toHaveProperty('id', createdAuthorId);
      expect(response.body.data.firstName).toBe(updateAuthorDto.firstName);
      expect(response.body.data.lastName).toBe(updateAuthorDto.lastName);
      expect(response.body.data.nationality).toBe(updateAuthorDto.nationality);
      expect(response.body.data.biography).toBe(updateAuthorDto.biography);
    });
  });

  describe('GET /book-authors (Get All Authors)', () => {
    it('should get all book authors with pagination', async () => {
      const response = await authHelper.get('/book-authors?page=1&limit=10').expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('POST /book-authors/search (Exact Search)', () => {
    it('should search book authors exactly', async () => {
      const searchDto = {
        firstName: 'Stephen',
        lastName: 'King'
      };

      const response = await authHelper.post('/book-authors/search?page=1&limit=10').send(searchDto).expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('GET /book-authors/filter (Simple Filter)', () => {
    it('should filter book authors with simple term', async () => {
      const response = await authHelper.get('/book-authors/filter?term=author&page=1&limit=10').expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });

    it('should return 400 when filter term is missing', async () => {
      await authHelper.get('/book-authors/filter?page=1&limit=10').expect(400);
    });
  });

  describe('POST /book-authors/advanced-filter (Advanced Filter)', () => {
    it('should filter book authors with advanced filters', async () => {
      const filters = {
        firstName: 'Stephen',
        nationality: 'American'
      };

      const response = await authHelper.post('/book-authors/advanced-filter?page=1&limit=10').send(filters).expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('GET /book-authors/export/csv (Export CSV)', () => {
    it('should export book authors to CSV', async () => {
      const response = await authHelper.get('/book-authors/export/csv').expect(200);

      expect(response.headers['content-type']).toMatch(/text\/csv/);
      expect(response.headers['content-disposition']).toMatch(/attachment/);
      expect(typeof response.text).toBe('string');
    });
  });

  describe('DELETE /book-authors/:id (Delete Author)', () => {
    it('should soft delete book author', async () => {
      const response = await authHelper.delete(`/api/book-authors/${createdAuthorId}`).expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/eliminado|deleted/i);
    });

    it('should not find deleted author', async () => {
      await authHelper.get(`/api/book-authors/${createdAuthorId}`).expect(404);
    });
  });
});