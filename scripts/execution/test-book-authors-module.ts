import { TestDataGenerator } from './test-data-generator';

const testDataGenerator = TestDataGenerator.getInstance();

export const bookAuthorsModuleTestConfig = {
  moduleName: 'BOOK_AUTHORS',
  baseUrl: 'http://localhost:3000/book-authors',
  endpoints: {
    // Success scenarios for ADMIN
    ADMIN_GET_AUTHORS_SUCCESS: {
      endpoint: '/',
      method: 'GET',
      role: 'ADMIN',
      description: 'Admin gets all book authors',
      expectedStatus: 200
    },
    ADMIN_CREATE_AUTHOR_SUCCESS: {
      endpoint: '/',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin creates new book author',
      expectedStatus: 201,
      data: () => ({
        firstName: testDataGenerator.generateUniqueName('Author'),
        lastName: testDataGenerator.generateUniqueName('Last'),
        biography: `Biography of ${testDataGenerator.generateUniqueName('Author')}`,
        birthDate: '1980-01-01',
        nationality: 'Colombian'
      })
    },
    ADMIN_SEARCH_AUTHORS_SUCCESS: {
      endpoint: '/search',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin searches book authors',
      expectedStatus: 200,
      data: {
        term: 'Gabriel'
      }
    },
    ADMIN_SIMPLE_FILTER_SUCCESS: {
      endpoint: '/filter',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin filters book authors',
      expectedStatus: 200,
      data: {
        term: 'Gabriel'
      }
    },
    ADMIN_ADVANCED_FILTER_SUCCESS: {
      endpoint: '/advanced-filter',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin advanced filter book authors',
      expectedStatus: 200,
      data: {
        firstName: 'Gabriel',
        nationality: 'Colombian'
      }
    },
    ADMIN_EXACT_SEARCH_SUCCESS: {
      endpoint: '/exact-search',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin exact search book authors',
      expectedStatus: 200,
      data: {
        firstName: 'Gabriel',
        lastName: 'García Márquez'
      }
    },
    ADMIN_GET_AUTHOR_BY_ID_SUCCESS: {
      endpoint: '/67890123-4567-8901-2345-678901234567',
      method: 'GET',
      role: 'ADMIN',
      description: 'Admin gets author by valid ID',
      expectedStatus: 200
    },
    ADMIN_UPDATE_AUTHOR_SUCCESS: {
      endpoint: '/67890123-4567-8901-2345-678901234567',
      method: 'PUT',
      role: 'ADMIN',
      description: 'Admin updates book author',
      expectedStatus: 200,
      data: {
        firstName: 'Gabriel José',
        lastName: 'García Márquez',
        biography: 'Updated biography of Gabriel García Márquez',
        birthDate: '1927-03-06',
        nationality: 'Colombian'
      }
    },
    ADMIN_DELETE_AUTHOR_SUCCESS: {
      endpoint: () => `/${testDataGenerator.generateValidId()}`,
      method: 'DELETE',
      role: 'ADMIN',
      description: 'Admin deletes book author',
      expectedStatus: 200
    },

    // Success scenarios for USER
    USER_GET_AUTHORS_SUCCESS: {
      endpoint: '/',
      method: 'GET',
      role: 'USER',
      description: 'User gets all book authors',
      expectedStatus: 200
    },
    USER_SEARCH_AUTHORS_SUCCESS: {
      endpoint: '/search',
      method: 'POST',
      role: 'USER',
      description: 'User searches book authors',
      expectedStatus: 200,
      data: {
        term: 'Gabriel'
      }
    },
    USER_SIMPLE_FILTER_SUCCESS: {
      endpoint: '/filter',
      method: 'POST',
      role: 'USER',
      description: 'User filters book authors',
      expectedStatus: 200,
      data: {
        term: 'Gabriel'
      }
    },
    USER_GET_AUTHOR_BY_ID_SUCCESS: {
      endpoint: '/67890123-4567-8901-2345-678901234567',
      method: 'GET',
      role: 'USER',
      description: 'User gets author by valid ID',
      expectedStatus: 200
    },

    // Validation errors - 400
    ADMIN_CREATE_AUTHOR_INVALID_DATA: {
      endpoint: '/',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin creates author with invalid data',
      expectedStatus: 400,
      expectedFailure: true,
      data: {
        firstName: '',
        lastName: '',
        biography: 'Biography',
        birthDate: 'invalid-date',
        nationality: 'Colombian'
      }
    },
    ADMIN_UPDATE_AUTHOR_INVALID_DATA: {
      endpoint: '/67890123-4567-8901-2345-678901234567',
      method: 'PUT',
      role: 'ADMIN',
      description: 'Admin updates author with invalid data',
      expectedStatus: 400,
      expectedFailure: true,
      data: {
        firstName: '',
        lastName: '',
        biography: '',
        birthDate: 'invalid-date',
        nationality: ''
      }
    },
    ADMIN_GET_AUTHOR_INVALID_ID: {
      endpoint: '/invalid-uuid',
      method: 'GET',
      role: 'ADMIN',
      description: 'Admin gets author with invalid ID format',
      expectedStatus: 400,
      expectedFailure: true
    },
    SEARCH_AUTHORS_EMPTY_TERM: {
      endpoint: '/search',
      method: 'POST',
      role: 'ADMIN',
      description: 'Search authors with empty term',
      expectedStatus: 400,
      expectedFailure: true,
      data: {
        term: ''
      }
    },

    // Authorization errors - 401/403
    NO_AUTH_GET_AUTHORS: {
      endpoint: '/',
      method: 'GET',
      role: 'NO_AUTH',
      description: 'Unauthenticated request to get authors',
      expectedStatus: 401,
      expectedFailure: true
    },
    USER_CREATE_AUTHOR_FORBIDDEN: {
      endpoint: '/',
      method: 'POST',
      role: 'USER',
      description: 'User attempts to create author (forbidden)',
      expectedStatus: 403,
      expectedFailure: true,
      data: {
        firstName: 'Test',
        lastName: 'Author',
        biography: 'Test biography',
        birthDate: '1980-01-01',
        nationality: 'Colombian'
      }
    },
    USER_UPDATE_AUTHOR_FORBIDDEN: {
      endpoint: '/67890123-4567-8901-2345-678901234567',
      method: 'PUT',
      role: 'USER',
      description: 'User attempts to update author (forbidden)',
      expectedStatus: 403,
      expectedFailure: true,
      data: {
        firstName: 'Updated',
        lastName: 'Author'
      }
    },
    USER_DELETE_AUTHOR_FORBIDDEN: {
      endpoint: '/67890123-4567-8901-2345-678901234567',
      method: 'DELETE',
      role: 'USER',
      description: 'User attempts to delete author (forbidden)',
      expectedStatus: 403,
      expectedFailure: true
    },

    // Not found errors - 404
    ADMIN_GET_AUTHOR_NOT_FOUND: {
      endpoint: '/99999999-9999-9999-9999-999999999999',
      method: 'GET',
      role: 'ADMIN',
      description: 'Admin gets non-existent author',
      expectedStatus: 404,
      expectedFailure: true
    },
    ADMIN_UPDATE_AUTHOR_NOT_FOUND: {
      endpoint: '/99999999-9999-9999-9999-999999999999',
      method: 'PUT',
      role: 'ADMIN',
      description: 'Admin updates non-existent author',
      expectedStatus: 404,
      expectedFailure: true,
      data: {
        firstName: 'Updated',
        lastName: 'Author'
      }
    },
    ADMIN_DELETE_AUTHOR_NOT_FOUND: {
      endpoint: '/99999999-9999-9999-9999-999999999999',
      method: 'DELETE',
      role: 'ADMIN',
      description: 'Admin deletes non-existent author',
      expectedStatus: 404,
      expectedFailure: true
    },

    // Conflict errors - 409
    ADMIN_CREATE_AUTHOR_DUPLICATE: {
      endpoint: '/',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin creates author with duplicate name',
      expectedStatus: 409,
      expectedFailure: true,
      data: {
        firstName: 'Gabriel',
        lastName: 'García Márquez',
        biography: 'Duplicate author',
        birthDate: '1927-03-06',
        nationality: 'Colombian'
      }
    }
  }
};