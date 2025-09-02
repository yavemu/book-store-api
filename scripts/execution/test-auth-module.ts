import { TestDataGenerator } from './test-data-generator';

const testDataGenerator = TestDataGenerator.getInstance();

export const authModuleTestConfig = {
  moduleName: 'AUTH',
  baseUrl: 'http://localhost:3000/auth',
  endpoints: {
    // Success scenarios
    REGISTER_SUCCESS: {
      endpoint: '/register',
      method: 'POST',
      role: 'NO_AUTH',
      description: 'Successful user registration',
      expectedStatus: 201,
      data: () => testDataGenerator.generateUniqueRegistrationData()
    },
    LOGIN_SUCCESS: {
      endpoint: '/login',
      method: 'POST',
      role: 'NO_AUTH',
      description: 'Successful user login',
      expectedStatus: 200,
      data: {
        email: 'admin@bookstore.com',
        password: 'admin123'
      }
    },

    // Validation errors - 400
    REGISTER_INVALID_EMAIL: {
      endpoint: '/register',
      method: 'POST',
      role: 'NO_AUTH',
      description: 'Registration with invalid email format',
      expectedStatus: 400,
      expectedFailure: true,
      data: {
        email: 'invalid-email-format',
        password: 'ValidPassword123!',
        username: 'testuser'
      }
    },
    REGISTER_MISSING_PASSWORD: {
      endpoint: '/register',
      method: 'POST',
      role: 'NO_AUTH',
      description: 'Registration missing password',
      expectedStatus: 400,
      expectedFailure: true,
      data: {
        email: 'test@example.com',
        username: 'testuser'
      }
    },
    REGISTER_WEAK_PASSWORD: {
      endpoint: '/register',
      method: 'POST',
      role: 'NO_AUTH',
      description: 'Registration with weak password',
      expectedStatus: 400,
      expectedFailure: true,
      data: {
        email: testDataGenerator.generateUniqueEmail('weak'),
        password: '123',
        username: 'testuser'
      }
    },
    LOGIN_MISSING_EMAIL: {
      endpoint: '/login',
      method: 'POST',
      role: 'NO_AUTH',
      description: 'Login missing email',
      expectedStatus: 400,
      expectedFailure: true,
      data: {
        password: 'admin123'
      }
    },
    LOGIN_MISSING_PASSWORD: {
      endpoint: '/login',
      method: 'POST',
      role: 'NO_AUTH',
      description: 'Login missing password',
      expectedStatus: 400,
      expectedFailure: true,
      data: {
        email: 'admin@bookstore.com'
      }
    },

    // Authentication errors - 401
    LOGIN_INVALID_CREDENTIALS: {
      endpoint: '/login',
      method: 'POST',
      role: 'NO_AUTH',
      description: 'Login with invalid credentials',
      expectedStatus: 401,
      expectedFailure: true,
      data: {
        email: 'admin@bookstore.com',
        password: 'wrongpassword'
      }
    },
    LOGIN_NONEXISTENT_USER: {
      endpoint: '/login',
      method: 'POST',
      role: 'NO_AUTH',
      description: 'Login with non-existent user',
      expectedStatus: 401,
      expectedFailure: true,
      data: {
        email: 'nonexistent@example.com',
        password: 'password123'
      }
    },

    // Conflict errors - 409
    REGISTER_DUPLICATE_EMAIL: {
      endpoint: '/register',
      method: 'POST',
      role: 'NO_AUTH',
      description: 'Registration with existing email',
      expectedStatus: 409,
      expectedFailure: true,
      data: {
        email: 'admin@bookstore.com', // This email already exists
        password: 'ValidPassword123!',
        username: 'newuser'
      }
    }
  }
};