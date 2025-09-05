import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthHelper } from './auth-helper';

describe('Book Author Assignments (e2e)', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  let createdAssignmentId: string;
  let testBookId: string;
  let testAuthorId: string;
  let testGenreId: string;
  let testPublisherId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    authHelper = new AuthHelper(app);

    // Create test data
    // Create a test genre
    const genreResponse = await authHelper.post('/genres')
      .send({
        name: 'E2E Assignment Genre ' + Date.now(),
        description: 'Test genre for assignments'
      });
    testGenreId = genreResponse.body.id;

    // Create a test publisher
    const publisherResponse = await authHelper.post('/publishing-houses')
      .send({
        name: 'E2E Assignment Publisher ' + Date.now(),
        country: 'Test Country'
      });
    testPublisherId = publisherResponse.body.id;

    // Create a test book
    const bookResponse = await authHelper.post('/book-catalog')
      .send({
        title: 'E2E Assignment Book ' + Date.now(),
        isbnCode: '978' + Date.now().toString().slice(-10),
        price: 25.99,
        genreId: testGenreId,
        publisherId: testPublisherId
      });
    testBookId = bookResponse.body.id;

    // Create a test author
    const authorResponse = await authHelper.post('/book-authors')
      .send({
        firstName: 'E2E Assignment Author ' + Date.now(),
        lastName: 'Test Author'
      });
    testAuthorId = authorResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /book-author-assignments (Create Assignment)', () => {
    it('should create a new book-author assignment', async () => {
      const createAssignmentDto = {
        bookId: testBookId,
        authorId: testAuthorId,
        authorRole: 'Main Author'
      };

      const response = await authHelper.post('/book-author-assignments').send(createAssignmentDto).expect(201);

      expect(response.body.data.data).toHaveProperty('id');
      expect(response.body.data.bookId).toBe(createAssignmentDto.bookId);
      expect(response.body.data.authorId).toBe(createAssignmentDto.authorId);
      expect(response.body).toHaveProperty('createdAt');
      
      createdAssignmentId = response.body.data.id;
    });
  });

  describe('GET /book-author-assignments/:id (Get Assignment by ID)', () => {
    it('should get book-author assignment by ID', async () => {
      const response = await authHelper.get(`/api/book-author-assignments/${createdAssignmentId}`).expect(200);

      expect(response.body.data.data).toHaveProperty('id', createdAssignmentId);
      expect(response.body).toHaveProperty('bookId');
      expect(response.body).toHaveProperty('authorId');
      expect(response.body).toHaveProperty('createdAt');
    });
  });

  describe('PUT /book-author-assignments/:id (Update Assignment)', () => {
    it('should update book-author assignment', async () => {
      const updateAssignmentDto = {
        authorRole: 'Co-Author'
      };

      const response = await authHelper.put(`/api/book-author-assignments/${createdAssignmentId}`).send(updateAssignmentDto).expect(200);

      expect(response.body.data.data).toHaveProperty('id', createdAssignmentId);
      expect(response.body).toHaveProperty('bookId');
      expect(response.body).toHaveProperty('authorId');
    });
  });

  describe('GET /book-author-assignments (Get All Assignments)', () => {
    it('should get all book-author assignments with pagination', async () => {
      const response = await authHelper.get('/book-author-assignments?page=1&limit=10').expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('POST /book-author-assignments/search (Exact Search)', () => {
    it('should search book-author assignments exactly', async () => {
      const searchDto = {
        bookId: testBookId,
        authorId: testAuthorId
      };

      const response = await authHelper.post('/book-author-assignments/search?page=1&limit=10').send(searchDto).expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('GET /book-author-assignments/filter (Simple Filter)', () => {
    it('should filter book-author assignments with simple term', async () => {
      const response = await authHelper.get('/book-author-assignments/filter?term=main&page=1&limit=10').expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });

    it('should return 400 when filter term is missing', async () => {
      await authHelper.get('/book-author-assignments/filter?page=1&limit=10').expect(400);
    });
  });

  describe('POST /book-author-assignments/advanced-filter (Advanced Filter)', () => {
    it('should filter book-author assignments with advanced filters', async () => {
      const filters = {
        bookId: testBookId
      };

      const response = await authHelper.post('/book-author-assignments/advanced-filter?page=1&limit=10').send(filters).expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('GET /book-author-assignments/export/csv (Export CSV)', () => {
    it('should export book-author assignments to CSV', async () => {
      const response = await authHelper.get('/book-author-assignments/export/csv').expect(200);

      expect(response.headers['content-type']).toMatch(/text\/csv/);
      expect(response.headers['content-disposition']).toMatch(/attachment/);
      expect(typeof response.text).toBe('string');
    });
  });

  describe('DELETE /book-author-assignments/:id (Delete Assignment)', () => {
    it('should soft delete book-author assignment', async () => {
      const response = await authHelper.delete(`/api/book-author-assignments/${createdAssignmentId}`).expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/eliminado|deleted/i);
    });

    it('should not find deleted assignment', async () => {
      await authHelper.get(`/api/book-author-assignments/${createdAssignmentId}`).expect(404);
    });
  });
});