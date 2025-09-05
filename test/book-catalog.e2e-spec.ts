import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthHelper } from './auth-helper';

describe('Book Catalog (e2e)', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  let createdBookId: string;
  let testGenreId: string;
  let testPublisherId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    authHelper = new AuthHelper(app);

    // Create a test genre for the book
    const genreResponse = await authHelper.post('/genres')
      .send({
        name: 'E2E Test Genre for Books ' + Date.now(),
        description: 'Test genre for book catalog E2E tests'
      });
    testGenreId = genreResponse.body.id;

    // Create a test publisher for the book
    const publisherResponse = await authHelper.post('/publishing-houses')
      .send({
        name: 'E2E Test Publisher for Books ' + Date.now(),
        country: 'Test Country',
        websiteUrl: 'https://test-publisher-books.com'
      });
    testPublisherId = publisherResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /book-catalog (Create Book)', () => {
    it('should create a new book', async () => {
      const createBookDto = {
        title: 'E2E Test Book ' + Date.now(),
        isbnCode: '978' + Date.now().toString().slice(-10),
        price: 29.99,
        isAvailable: true,
        stockQuantity: 10,
        publicationDate: '2023-01-01',
        pageCount: 300,
        summary: 'This is a test book created during E2E testing',
        genreId: testGenreId,
        publisherId: testPublisherId
      };

      const response = await authHelper.post('/book-catalog').send(createBookDto).expect(201);

      expect(response.body.data.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(createBookDto.title);
      expect(response.body.data.isbnCode).toBe(createBookDto.isbnCode);
      expect(parseFloat(response.body.data.price)).toBe(createBookDto.price);
      expect(response.body.data.isAvailable).toBe(createBookDto.isAvailable);
      expect(response.body.data.stockQuantity).toBe(createBookDto.stockQuantity);
      expect(response.body.data.summary).toBe(createBookDto.summary);
      expect(response.body.data.genreId).toBe(createBookDto.genreId);
      expect(response.body.data.publisherId).toBe(createBookDto.publisherId);
      expect(response.body).toHaveProperty('createdAt');
      
      createdBookId = response.body.data.id;
    });
  });

  describe('GET /book-catalog/:id (Get Book by ID)', () => {
    it('should get book by ID', async () => {
      const response = await authHelper.get(`/api/book-catalog/${createdBookId}`).expect(200);

      expect(response.body.data.data).toHaveProperty('id', createdBookId);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('isbnCode');
      expect(response.body).toHaveProperty('price');
      expect(response.body).toHaveProperty('isAvailable');
      expect(response.body).toHaveProperty('stockQuantity');
      expect(response.body).toHaveProperty('genreId');
      expect(response.body).toHaveProperty('publisherId');
      expect(response.body).toHaveProperty('createdAt');
    });
  });

  describe('PUT /book-catalog/:id (Update Book)', () => {
    it('should update book', async () => {
      const updateBookDto = {
        title: 'Updated E2E Test Book ' + Date.now(),
        price: 39.99,
        stockQuantity: 15,
        summary: 'This is an updated test book summary'
      };

      const response = await authHelper.put(`/api/book-catalog/${createdBookId}`).send(updateBookDto).expect(200);

      expect(response.body.data.data).toHaveProperty('id', createdBookId);
      expect(response.body.data.title).toBe(updateBookDto.title);
      expect(parseFloat(response.body.data.price)).toBe(updateBookDto.price);
      expect(response.body.data.stockQuantity).toBe(updateBookDto.stockQuantity);
      expect(response.body.data.summary).toBe(updateBookDto.summary);
    });
  });

  describe('GET /book-catalog (Get All Books)', () => {
    it('should get all books with pagination', async () => {
      const response = await authHelper.get('/book-catalog?page=1&limit=10').expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('POST /book-catalog/search (Exact Search)', () => {
    it('should search books exactly', async () => {
      const searchDto = {
        title: 'Test',
        isAvailable: true
      };

      const response = await authHelper.post('/book-catalog/search?page=1&limit=10').send(searchDto).expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('GET /book-catalog/filter (Simple Filter)', () => {
    it('should filter books with simple term', async () => {
      const response = await authHelper.get('/book-catalog/filter?term=test&page=1&limit=10').expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('POST /book-catalog/advanced-filter (Advanced Filter)', () => {
    it('should filter books with advanced filters', async () => {
      const filters = {
        title: 'Test',
        isAvailable: true,
        priceRange: {
          min: 10,
          max: 100
        }
      };

      const response = await authHelper.post('/book-catalog/advanced-filter?page=1&limit=10').send(filters).expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('GET /book-catalog/export/csv (Export CSV)', () => {
    it('should export books to CSV', async () => {
      const response = await authHelper.get('/book-catalog/export/csv').expect(200);

      expect(response.headers['content-type']).toMatch(/text\/csv/);
      expect(response.headers['content-disposition']).toMatch(/attachment/);
      expect(typeof response.text).toBe('string');
    });
  });

  describe('Book Cover Operations', () => {
    it('should handle book cover removal (even if no cover exists)', async () => {
      const response = await authHelper.delete(`/api/book-catalog/${createdBookId}/cover`).expect(200);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /book-catalog/:id (Delete Book)', () => {
    it('should soft delete book', async () => {
      const response = await authHelper.delete(`/api/book-catalog/${createdBookId}`).expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/eliminado|deleted/i);
    });

    it('should not find deleted book', async () => {
      await authHelper.get(`/api/book-catalog/${createdBookId}`).expect(404);
    });
  });
});