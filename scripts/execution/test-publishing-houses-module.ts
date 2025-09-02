import { TestDataGenerator } from './test-data-generator';

const testDataGenerator = TestDataGenerator.getInstance();

export const publishingHousesModuleTestConfig = {
  moduleName: 'PUBLISHING_HOUSES',
  baseUrl: 'http://localhost:3000/publishing-houses',
  endpoints: {
    // Success scenarios for ADMIN
    ADMIN_GET_PUBLISHERS_SUCCESS: {
      endpoint: '/',
      method: 'GET',
      role: 'ADMIN',
      description: 'Admin gets all publishing houses',
      expectedStatus: 200
    },
    ADMIN_CREATE_PUBLISHER_SUCCESS: {
      endpoint: '/',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin creates new publishing house',
      expectedStatus: 201,
      data: () => ({
        name: testDataGenerator.generateUniqueName('Publisher'),
        address: `Address ${testDataGenerator.generateUniqueName('Street')}`,
        country: 'Colombia',
        foundedYear: 2000
      })
    },
    ADMIN_SEARCH_PUBLISHERS_SUCCESS: {
      endpoint: '/search',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin searches publishing houses',
      expectedStatus: 200,
      data: {
        term: 'Planeta'
      }
    },
    ADMIN_SIMPLE_FILTER_SUCCESS: {
      endpoint: '/filter',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin filters publishing houses',
      expectedStatus: 200,
      data: {
        term: 'Planeta'
      }
    },
    ADMIN_ADVANCED_FILTER_SUCCESS: {
      endpoint: '/advanced-filter',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin advanced filter publishing houses',
      expectedStatus: 200,
      data: {
        name: 'Planeta',
        country: 'Colombia'
      }
    },
    ADMIN_EXACT_SEARCH_SUCCESS: {
      endpoint: '/exact-search',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin exact search publishing houses',
      expectedStatus: 200,
      data: {
        name: 'Editorial Planeta',
        country: 'Colombia'
      }
    },
    ADMIN_GET_PUBLISHERS_BY_COUNTRY_SUCCESS: {
      endpoint: '/by-country/Colombia',
      method: 'GET',
      role: 'ADMIN',
      description: 'Admin gets publishers by country',
      expectedStatus: 200
    },
    ADMIN_GET_PUBLISHER_BY_ID_SUCCESS: {
      endpoint: '/34567890-3456-7890-1234-567890123456',
      method: 'GET',
      role: 'ADMIN',
      description: 'Admin gets publisher by valid ID',
      expectedStatus: 200
    },
    ADMIN_UPDATE_PUBLISHER_SUCCESS: {
      endpoint: '/34567890-3456-7890-1234-567890123456',
      method: 'PUT',
      role: 'ADMIN',
      description: 'Admin updates publishing house',
      expectedStatus: 200,
      data: {
        name: 'Editorial Planeta Colombia',
        address: 'Calle 123 #45-67, Bogotá',
        country: 'Colombia',
        foundedYear: 1982
      }
    },
    ADMIN_DELETE_PUBLISHER_SUCCESS: {
      endpoint: () => `/${testDataGenerator.generateValidId()}`,
      method: 'DELETE',
      role: 'ADMIN',
      description: 'Admin deletes publishing house',
      expectedStatus: 200
    },

    // Success scenarios for USER
    USER_GET_PUBLISHERS_SUCCESS: {
      endpoint: '/',
      method: 'GET',
      role: 'USER',
      description: 'User gets all publishing houses',
      expectedStatus: 200
    },
    USER_SEARCH_PUBLISHERS_SUCCESS: {
      endpoint: '/search',
      method: 'POST',
      role: 'USER',
      description: 'User searches publishing houses',
      expectedStatus: 200,
      data: {
        term: 'Planeta'
      }
    },
    USER_SIMPLE_FILTER_SUCCESS: {
      endpoint: '/filter',
      method: 'POST',
      role: 'USER',
      description: 'User filters publishing houses',
      expectedStatus: 200,
      data: {
        term: 'Planeta'
      }
    },
    USER_GET_PUBLISHERS_BY_COUNTRY_SUCCESS: {
      endpoint: '/by-country/Colombia',
      method: 'GET',
      role: 'USER',
      description: 'User gets publishers by country',
      expectedStatus: 200
    },
    USER_GET_PUBLISHER_BY_ID_SUCCESS: {
      endpoint: '/34567890-3456-7890-1234-567890123456',
      method: 'GET',
      role: 'USER',
      description: 'User gets publisher by valid ID',
      expectedStatus: 200
    },

    // Validation errors - 400
    ADMIN_CREATE_PUBLISHER_INVALID_DATA: {
      endpoint: '/',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin creates publisher with invalid data',
      expectedStatus: 400,
      expectedFailure: true,
      data: {
        name: '',
        address: '',
        country: '',
        foundedYear: 'invalid-year'
      }
    },
    ADMIN_UPDATE_PUBLISHER_INVALID_DATA: {
      endpoint: '/34567890-3456-7890-1234-567890123456',
      method: 'PUT',
      role: 'ADMIN',
      description: 'Admin updates publisher with invalid data',
      expectedStatus: 400,
      expectedFailure: true,
      data: {
        name: '',
        address: '',
        country: '',
        foundedYear: 'invalid-year'
      }
    },
    ADMIN_GET_PUBLISHER_INVALID_ID: {
      endpoint: '/invalid-uuid',
      method: 'GET',
      role: 'ADMIN',
      description: 'Admin gets publisher with invalid ID format',
      expectedStatus: 400,
      expectedFailure: true
    },
    SEARCH_PUBLISHERS_EMPTY_TERM: {
      endpoint: '/search',
      method: 'POST',
      role: 'ADMIN',
      description: 'Search publishers with empty term',
      expectedStatus: 400,
      expectedFailure: true,
      data: {
        term: ''
      }
    },

    // Authorization errors - 401/403
    NO_AUTH_GET_PUBLISHERS: {
      endpoint: '/',
      method: 'GET',
      role: 'NO_AUTH',
      description: 'Unauthenticated request to get publishers',
      expectedStatus: 401,
      expectedFailure: true
    },
    USER_CREATE_PUBLISHER_FORBIDDEN: {
      endpoint: '/',
      method: 'POST',
      role: 'USER',
      description: 'User attempts to create publisher (forbidden)',
      expectedStatus: 403,
      expectedFailure: true,
      data: {
        name: 'Test Publisher',
        address: 'Test Address',
        country: 'Colombia',
        foundedYear: 2000
      }
    },
    USER_UPDATE_PUBLISHER_FORBIDDEN: {
      endpoint: '/34567890-3456-7890-1234-567890123456',
      method: 'PUT',
      role: 'USER',
      description: 'User attempts to update publisher (forbidden)',
      expectedStatus: 403,
      expectedFailure: true,
      data: {
        name: 'Updated Publisher'
      }
    },
    USER_DELETE_PUBLISHER_FORBIDDEN: {
      endpoint: '/34567890-3456-7890-1234-567890123456',
      method: 'DELETE',
      role: 'USER',
      description: 'User attempts to delete publisher (forbidden)',
      expectedStatus: 403,
      expectedFailure: true
    },

    // Not found errors - 404
    ADMIN_GET_PUBLISHER_NOT_FOUND: {
      endpoint: '/99999999-9999-9999-9999-999999999999',
      method: 'GET',
      role: 'ADMIN',
      description: 'Admin gets non-existent publisher',
      expectedStatus: 404,
      expectedFailure: true
    },
    ADMIN_UPDATE_PUBLISHER_NOT_FOUND: {
      endpoint: '/99999999-9999-9999-9999-999999999999',
      method: 'PUT',
      role: 'ADMIN',
      description: 'Admin updates non-existent publisher',
      expectedStatus: 404,
      expectedFailure: true,
      data: {
        name: 'Updated Publisher'
      }
    },
    ADMIN_DELETE_PUBLISHER_NOT_FOUND: {
      endpoint: '/99999999-9999-9999-9999-999999999999',
      method: 'DELETE',
      role: 'ADMIN',
      description: 'Admin deletes non-existent publisher',
      expectedStatus: 404,
      expectedFailure: true
    },
    ADMIN_GET_PUBLISHERS_BY_INVALID_COUNTRY: {
      endpoint: '/by-country/NonExistentCountry',
      method: 'GET',
      role: 'ADMIN',
      description: 'Admin gets publishers by non-existent country',
      expectedStatus: 404,
      expectedFailure: true
    },

    // Conflict errors - 409
    ADMIN_CREATE_PUBLISHER_DUPLICATE: {
      endpoint: '/',
      method: 'POST',
      role: 'ADMIN',
      description: 'Admin creates publisher with duplicate name',
      expectedStatus: 409,
      expectedFailure: true,
      data: {
        name: 'Editorial Planeta',
        address: 'Duplicate address',
        country: 'Colombia',
        foundedYear: 2000
      }
    }
  }
};