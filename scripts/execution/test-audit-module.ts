import { TestDataGenerator } from './test-data-generator';

const testDataGenerator = TestDataGenerator.getInstance();

export const auditModuleTestConfig = {
  moduleName: 'AUDIT',
  baseUrl: 'http://localhost:3000/audit',
  endpoints: {
    // ADMIN endpoints
    ADMIN_GET_AUDIT_LOGS: {
      endpoint: '/',
      method: 'GET',
      role: 'ADMIN',
      description: 'Get all audit logs',
      expectedStatus: 200
    },
    ADMIN_SEARCH_AUDIT: {
      endpoint: '/search',
      method: 'POST',
      role: 'ADMIN',
      description: 'Search audit logs',
      expectedStatus: 200,
      data: {
        term: 'CREATE'
      }
    },
    ADMIN_FILTER_AUDIT: {
      endpoint: '/filter',
      method: 'POST',
      role: 'ADMIN',
      description: 'Filter audit logs',
      expectedStatus: 200,
      data: {
        term: 'user'
      }
    },
    ADMIN_EXACT_SEARCH_AUDIT: {
      endpoint: '/exact-search',
      method: 'POST',
      role: 'ADMIN',
      description: 'Exact search audit logs',
      expectedStatus: 200,
      data: {
        action: 'CREATE',
        userId: testDataGenerator.generateValidId()
      }
    },

    // USER endpoints - should be forbidden
    USER_GET_AUDIT_LOGS: {
      endpoint: '/',
      method: 'GET',
      role: 'USER',
      description: 'User attempts to get audit logs',
      expectedStatus: 403,
      expectedFailure: true
    },
    USER_SEARCH_AUDIT: {
      endpoint: '/search',
      method: 'POST',
      role: 'USER',
      description: 'User attempts to search audit logs',
      expectedStatus: 403,
      expectedFailure: true,
      data: {
        term: 'CREATE'
      }
    },

    // NO_AUTH endpoints - should be unauthorized
    NO_AUTH_GET_AUDIT_LOGS: {
      endpoint: '/',
      method: 'GET',
      role: 'NO_AUTH',
      description: 'Unauthenticated request to get audit logs',
      expectedStatus: 401,
      expectedFailure: true
    }
  }
};