import { TestDataGenerator } from './test-data-generator';

const testDataGenerator = TestDataGenerator.getInstance();

export const usersModuleTestConfig = {
  moduleName: 'USERS',
  baseUrl: 'http://localhost:3000/users',
  endpoints: {
    // Success scenarios for ADMIN
    ADMIN_GET_USERS_SUCCESS: {
      endpoint: '/',
      method: 'GET',
      role: 'ADMIN',
      description: 'Admin gets all users',
      expectedStatus: 200
    },
    ADMIN_CREATE_USER_SUCCESS: {
      endpoint: '/',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin creates new user',
      expectedStatus: 201,
      data: () => ({
        email: testDataGenerator.generateUniqueEmail('admin-create'),
        password: 'SecurePass123!',
        username: `admin_user_${testDataGenerator.executionId}_${Date.now()}`.substring(0, 50),
        role: 'USER'
      })
    },
    ADMIN_SEARCH_USERS_SUCCESS: {
      endpoint: '/search',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin searches users',
      expectedStatus: 200,
      data: {
        term: 'admin'
      }
    },
    ADMIN_SIMPLE_FILTER_SUCCESS: {
      endpoint: '/filter',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin filters users',
      expectedStatus: 200,
      data: {
        term: 'admin'
      }
    },
    ADMIN_EXACT_SEARCH_SUCCESS: {
      endpoint: '/exact-search',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin exact search users',
      expectedStatus: 200,
      data: {
        email: 'admin@bookstore.com',
        role: 'ADMIN'
      }
    },
    ADMIN_GET_USER_BY_ID_SUCCESS: {
      endpoint: '/56789012-5678-9012-3456-789012345678',
      method: 'GET',
      role: 'ADMIN',
      description: 'Admin gets user by valid ID',
      expectedStatus: 200
    },
    ADMIN_UPDATE_USER_SUCCESS: {
      endpoint: '/56789012-5678-9012-3456-789012345678',
      method: 'PUT',
      role: 'ADMIN',
      description: 'Admin updates user',
      expectedStatus: 200,
      data: {
        email: 'updated.user@bookstore.com',
        username: 'updated_user',
        role: 'USER'
      }
    },
    ADMIN_DELETE_USER_SUCCESS: {
      endpoint: () => `/${testDataGenerator.generateValidId()}`,
      method: 'DELETE',
      role: 'ADMIN',
      description: 'Admin deletes user',
      expectedStatus: 200
    },

    // Success scenarios for USER (limited access)
    USER_GET_OWN_PROFILE_SUCCESS: {
      endpoint: '/profile',
      method: 'GET',
      role: 'USER',
      description: 'User gets own profile',
      expectedStatus: 200
    },
    USER_UPDATE_OWN_PROFILE_SUCCESS: {
      endpoint: '/profile',
      method: 'PUT',
      role: 'USER',
      description: 'User updates own profile',
      expectedStatus: 200,
      data: {
        email: 'user.updated@bookstore.com',
        username: 'user_updated'
      }
    },

    // Validation errors - 400
    ADMIN_CREATE_USER_INVALID_DATA: {
      endpoint: '/',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin creates user with invalid data',
      expectedStatus: 400,
      expectedFailure: true,
      data: {
        email: 'invalid-email-format',
        password: '123',
        username: '',
        role: 'INVALID_ROLE'
      }
    },
    ADMIN_UPDATE_USER_INVALID_DATA: {
      endpoint: '/56789012-5678-9012-3456-789012345678',
      method: 'PUT',
      role: 'ADMIN',
      description: 'Admin updates user with invalid data',
      expectedStatus: 400,
      expectedFailure: true,
      data: {
        email: 'invalid-email-format',
        username: '',
        role: 'INVALID_ROLE'
      }
    },
    ADMIN_GET_USER_INVALID_ID: {
      endpoint: '/invalid-uuid',
      method: 'GET',
      role: 'ADMIN',
      description: 'Admin gets user with invalid ID format',
      expectedStatus: 400,
      expectedFailure: true
    },
    SEARCH_USERS_EMPTY_TERM: {
      endpoint: '/search',
      method: 'POST',
      role: 'ADMIN',
      description: 'Search users with empty term',
      expectedStatus: 400,
      expectedFailure: true,
      data: {
        term: ''
      }
    },

    // Authorization errors - 401/403
    NO_AUTH_GET_USERS: {
      endpoint: '/',
      method: 'GET',
      role: 'NO_AUTH',
      description: 'Unauthenticated request to get users',
      expectedStatus: 401,
      expectedFailure: true
    },
    NO_AUTH_GET_PROFILE: {
      endpoint: '/profile',
      method: 'GET',
      role: 'NO_AUTH',
      description: 'Unauthenticated request to get profile',
      expectedStatus: 401,
      expectedFailure: true
    },
    USER_GET_ALL_USERS_FORBIDDEN: {
      endpoint: '/',
      method: 'GET',
      role: 'USER',
      description: 'User attempts to get all users (forbidden)',
      expectedStatus: 403,
      expectedFailure: true
    },
    USER_CREATE_USER_FORBIDDEN: {
      endpoint: '/',
      method: 'POST',
      role: 'USER',
      description: 'User attempts to create user (forbidden)',
      expectedStatus: 403,
      expectedFailure: true,
      data: {
        email: 'test@example.com',
        password: 'TestPass123!',
        username: 'testuser',
        role: 'USER'
      }
    },
    USER_GET_OTHER_USER_FORBIDDEN: {
      endpoint: '/56789012-5678-9012-3456-789012345678',
      method: 'GET',
      role: 'USER',
      description: 'User attempts to get other user (forbidden)',
      expectedStatus: 403,
      expectedFailure: true
    },
    USER_UPDATE_OTHER_USER_FORBIDDEN: {
      endpoint: '/56789012-5678-9012-3456-789012345678',
      method: 'PUT',
      role: 'USER',
      description: 'User attempts to update other user (forbidden)',
      expectedStatus: 403,
      expectedFailure: true,
      data: {
        username: 'hacked_user'
      }
    },
    USER_DELETE_USER_FORBIDDEN: {
      endpoint: '/56789012-5678-9012-3456-789012345678',
      method: 'DELETE',
      role: 'USER',
      description: 'User attempts to delete user (forbidden)',
      expectedStatus: 403,
      expectedFailure: true
    },

    // Not found errors - 404
    ADMIN_GET_USER_NOT_FOUND: {
      endpoint: '/99999999-9999-9999-9999-999999999999',
      method: 'GET',
      role: 'ADMIN',
      description: 'Admin gets non-existent user',
      expectedStatus: 404,
      expectedFailure: true
    },
    ADMIN_UPDATE_USER_NOT_FOUND: {
      endpoint: '/99999999-9999-9999-9999-999999999999',
      method: 'PUT',
      role: 'ADMIN',
      description: 'Admin updates non-existent user',
      expectedStatus: 404,
      expectedFailure: true,
      data: {
        username: 'updated_user'
      }
    },
    ADMIN_DELETE_USER_NOT_FOUND: {
      endpoint: '/99999999-9999-9999-9999-999999999999',
      method: 'DELETE',
      role: 'ADMIN',
      description: 'Admin deletes non-existent user',
      expectedStatus: 404,
      expectedFailure: true
    },

    // Conflict errors - 409
    ADMIN_CREATE_USER_DUPLICATE_EMAIL: {
      endpoint: '/',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin creates user with duplicate email',
      expectedStatus: 409,
      expectedFailure: true,
      data: {
        email: 'admin@bookstore.com',
        password: 'ValidPass123!',
        username: 'duplicate_user',
        role: 'USER'
      }
    },
    ADMIN_CREATE_USER_DUPLICATE_USERNAME: {
      endpoint: '/',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin creates user with duplicate username',
      expectedStatus: 409,
      expectedFailure: true,
      data: {
        email: testDataGenerator.generateUniqueEmail('duplicate-username'),
        password: 'ValidPass123!',
        username: 'admin',
        role: 'USER'
      }
    }
  }
};