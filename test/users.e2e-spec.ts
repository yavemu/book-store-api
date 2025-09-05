import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthHelper } from './auth-helper';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  let createdUserId: string;

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

  describe('POST /users (Create User)', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        username: 'testuser_' + Date.now(),
        email: `testuser_${Date.now()}@example.com`,
        password: 'password123'
      };

      const response = await authHelper.post('/api/users').send(createUserDto).expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.username).toBe(createUserDto.username);
      expect(response.body.data.email).toBe(createUserDto.email.toLowerCase());
      expect(response.body.data).not.toHaveProperty('password');
      
      createdUserId = response.body.data.id;
    });
  });

  describe('GET /users/:id (Get User by ID)', () => {
    it('should get user by ID', async () => {
      const response = await authHelper.get(`/api/users/${createdUserId}`).expect(200);

      expect(response.body.data).toHaveProperty('id', createdUserId);
      expect(response.body.data).toHaveProperty('username');
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).not.toHaveProperty('password');
    });
  });

  describe('PUT /users/:id (Update User)', () => {
    it('should update user', async () => {
      const updateUserDto = {
        username: 'updateduser_' + Date.now(),
        email: `updateduser_${Date.now()}@example.com`
      };

      const response = await authHelper.put(`/api/users/${createdUserId}`).send(updateUserDto).expect(200);

      expect(response.body.data).toHaveProperty('id', createdUserId);
      expect(response.body.data.username).toBe(updateUserDto.username);
      expect(response.body.data.email).toBe(updateUserDto.email.toLowerCase());
    });
  });

  describe('GET /users (Get All Users)', () => {
    it('should get all users with pagination', async () => {
      const response = await authHelper.get('/api/users?page=1&limit=10').expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(response.body.data.meta).toHaveProperty('page');
      expect(response.body.data.meta).toHaveProperty('limit');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('POST /users/search (Exact Search)', () => {
    it('should search users exactly', async () => {
      const searchDto = {
        username: 'admin'
      };

      const response = await authHelper.post('/api/users/search?page=1&limit=10').send(searchDto).expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('GET /users/filter (Simple Filter)', () => {
    it('should filter users with simple term', async () => {
      const response = await authHelper.get('/api/users/filter?term=admin&page=1&limit=10').expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('POST /users/advanced-filter (Advanced Filter)', () => {
    it('should filter users with advanced filters', async () => {
      const filters = {
        username: 'admin',
        email: 'admin@demo.com'
      };

      const response = await authHelper.post('/api/users/advanced-filter?page=1&limit=10').send(filters).expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('GET /users/export/csv (Export CSV)', () => {
    it('should export users to CSV', async () => {
      const response = await authHelper.get('/api/users/export/csv').expect(200);

      expect(response.headers['content-type']).toMatch(/text\/csv/);
      expect(response.headers['content-disposition']).toMatch(/attachment/);
      expect(typeof response.text).toBe('string');
    });
  });

  describe('DELETE /users/:id (Delete User)', () => {
    it('should soft delete user', async () => {
      const response = await authHelper.delete(`/api/users/${createdUserId}`).expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/eliminado|deleted/i);
    });

    it('should not find deleted user', async () => {
      await authHelper.get(`/api/users/${createdUserId}`).expect(404);
    });
  });
});