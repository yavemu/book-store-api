import { TestDataGenerator } from './test-data-generator';

const testDataGenerator = TestDataGenerator.getInstance();

export const bookGenresModuleTestConfig = {
  moduleName: 'BOOK_GENRES',
  baseUrl: 'http://localhost:3000/book-genres',
  endpoints: {
    // Success scenarios for ADMIN
    ADMIN_GET_GENRES_SUCCESS: {
      endpoint: '/',
      method: 'GET',
      role: 'ADMIN',
      description: 'Admin gets all book genres',
      expectedStatus: 200
    },
    ADMIN_CREATE_GENRE_SUCCESS: {
      endpoint: '/',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin creates new book genre',
      expectedStatus: 201,
      data: () => ({
        name: testDataGenerator.generateUniqueName('Genre'),
        description: `Description of ${testDataGenerator.generateUniqueName('Genre')}`
      })
    },
    ADMIN_SEARCH_GENRES_SUCCESS: {
      endpoint: '/search',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin searches book genres',
      expectedStatus: 200,
      data: {
        term: 'Fiction'
      }
    },
    ADMIN_SIMPLE_FILTER_SUCCESS: {
      endpoint: '/filter',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin filters book genres',
      expectedStatus: 200,
      data: {
        term: 'Fiction'
      }
    },
    ADMIN_EXACT_SEARCH_SUCCESS: {
      endpoint: '/exact-search',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin exact search book genres',
      expectedStatus: 200,
      data: {
        name: 'Fiction'
      }
    },
    ADMIN_GET_GENRE_BY_ID_SUCCESS: {
      endpoint: '/12345678-1234-5678-9012-123456789012',
      method: 'GET',
      role: 'ADMIN',
      description: 'Admin gets genre by valid ID',
      expectedStatus: 200
    },
    ADMIN_UPDATE_GENRE_SUCCESS: {
      endpoint: '/12345678-1234-5678-9012-123456789012',
      method: 'PUT',
      role: 'ADMIN',
      description: 'Admin updates book genre',
      expectedStatus: 200,
      data: {
        name: 'Literary Fiction',
        description: 'Updated description for literary fiction genre'
      }
    },
    ADMIN_DELETE_GENRE_SUCCESS: {
      endpoint: () => `/${testDataGenerator.generateValidId()}`,
      method: 'DELETE',
      role: 'ADMIN',
      description: 'Admin deletes book genre',
      expectedStatus: 200
    },

    // Success scenarios for USER
    USER_GET_GENRES_SUCCESS: {
      endpoint: '/',
      method: 'GET',
      role: 'USER',
      description: 'User gets all book genres',
      expectedStatus: 200
    },
    USER_SEARCH_GENRES_SUCCESS: {
      endpoint: '/search',
      method: 'POST',
      role: 'USER',
      description: 'User searches book genres',
      expectedStatus: 200,
      data: {
        term: 'Fiction'
      }
    },
    USER_SIMPLE_FILTER_SUCCESS: {
      endpoint: '/filter',
      method: 'POST',
      role: 'USER',
      description: 'User filters book genres',
      expectedStatus: 200,
      data: {
        term: 'Fiction'
      }
    },
    USER_GET_GENRE_BY_ID_SUCCESS: {
      endpoint: '/12345678-1234-5678-9012-123456789012',
      method: 'GET',
      role: 'USER',
      description: 'User gets genre by valid ID',
      expectedStatus: 200
    },

    // Validation errors - 400
    ADMIN_CREATE_GENRE_INVALID_DATA: {
      endpoint: '/',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin creates genre with invalid data',
      expectedStatus: 400,
      expectedFailure: true,
      data: {
        name: '',
        description: ''
      }
    },
    ADMIN_UPDATE_GENRE_INVALID_DATA: {
      endpoint: '/12345678-1234-5678-9012-123456789012',
      method: 'PUT',
      role: 'ADMIN',
      description: 'Admin updates genre with invalid data',
      expectedStatus: 400,
      expectedFailure: true,
      data: {
        name: '',
        description: ''
      }
    },
    ADMIN_GET_GENRE_INVALID_ID: {
      endpoint: '/invalid-uuid',
      method: 'GET',
      role: 'ADMIN',
      description: 'Admin gets genre with invalid ID format',
      expectedStatus: 400,
      expectedFailure: true
    },
    SEARCH_GENRES_EMPTY_TERM: {
      endpoint: '/search',
      method: 'POST',
      role: 'ADMIN',
      description: 'Search genres with empty term',
      expectedStatus: 400,
      expectedFailure: true,
      data: {
        term: ''
      }
    },

    // Authorization errors - 401/403
    NO_AUTH_GET_GENRES: {
      endpoint: '/',
      method: 'GET',
      role: 'NO_AUTH',
      description: 'Unauthenticated request to get genres',
      expectedStatus: 401,
      expectedFailure: true
    },
    USER_CREATE_GENRE_FORBIDDEN: {
      endpoint: '/',
      method: 'POST',
      role: 'USER',
      description: 'User attempts to create genre (forbidden)',
      expectedStatus: 403,
      expectedFailure: true,
      data: {
        name: 'Test Genre',
        description: 'Test description'
      }
    },
    USER_UPDATE_GENRE_FORBIDDEN: {
      endpoint: '/12345678-1234-5678-9012-123456789012',
      method: 'PUT',
      role: 'USER',
      description: 'User attempts to update genre (forbidden)',
      expectedStatus: 403,
      expectedFailure: true,
      data: {
        name: 'Updated Genre'
      }
    },
    USER_DELETE_GENRE_FORBIDDEN: {
      endpoint: '/12345678-1234-5678-9012-123456789012',
      method: 'DELETE',
      role: 'USER',
      description: 'User attempts to delete genre (forbidden)',
      expectedStatus: 403,
      expectedFailure: true
    },

    // Not found errors - 404
    ADMIN_GET_GENRE_NOT_FOUND: {
      endpoint: '/99999999-9999-9999-9999-999999999999',
      method: 'GET',
      role: 'ADMIN',
      description: 'Admin gets non-existent genre',
      expectedStatus: 404,
      expectedFailure: true
    },
    ADMIN_UPDATE_GENRE_NOT_FOUND: {
      endpoint: '/99999999-9999-9999-9999-999999999999',
      method: 'PUT',
      role: 'ADMIN',
      description: 'Admin updates non-existent genre',
      expectedStatus: 404,
      expectedFailure: true,
      data: {
        name: 'Updated Genre'
      }
    },
    ADMIN_DELETE_GENRE_NOT_FOUND: {
      endpoint: '/99999999-9999-9999-9999-999999999999',
      method: 'DELETE',
      role: 'ADMIN',
      description: 'Admin deletes non-existent genre',
      expectedStatus: 404,
      expectedFailure: true
    },

    // Conflict errors - 409
    ADMIN_CREATE_GENRE_DUPLICATE: {
      endpoint: '/',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin creates genre with duplicate name',
      expectedStatus: 409,
      expectedFailure: true,
      data: {
        name: 'Fiction',
        description: 'Duplicate genre'
      }
    }
  }
};