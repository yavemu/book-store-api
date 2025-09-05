import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export class AuthHelper {
  private app: INestApplication;
  private adminToken: string = null;

  constructor(app: INestApplication) {
    this.app = app;
  }

  async getAdminToken(): Promise<string> {
    if (this.adminToken) {
      return this.adminToken;
    }

    const loginResponse = await request(this.app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@demo.com',
        password: 'demodemo'
      })
      .expect(201);

    this.adminToken = loginResponse.body.data.access_token;
    return this.adminToken;
  }

  get(url: string) {
    return this.makeAuthenticatedRequest('get', url);
  }

  post(url: string) {
    return this.makeAuthenticatedRequest('post', url);
  }

  put(url: string) {
    return this.makeAuthenticatedRequest('put', url);
  }

  patch(url: string) {
    return this.makeAuthenticatedRequest('patch', url);
  }

  delete(url: string) {
    return this.makeAuthenticatedRequest('delete', url);
  }

  private makeAuthenticatedRequest(method: 'get' | 'post' | 'put' | 'patch' | 'delete', url: string) {
    if (this.adminToken) {
      return request(this.app.getHttpServer())[method](url)
        .set('Authorization', `Bearer ${this.adminToken}`);
    } else {
      throw new Error('No admin token available. Make sure to login first.');
    }
  }

  clearToken() {
    this.adminToken = null;
  }
}