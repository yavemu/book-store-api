# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build & Development
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start development server with debugging
- `npm run start:prod` - Start production server

### Testing
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests

### Code Quality
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier

### Docker Development
- `npm run docker:up:build` - Build and start all services (API + Database)
- `npm run docker:up` - Start existing containers
- `npm run docker:down` - Stop and remove containers
- `npm run docker:logs` - View logs from all services
- `npm run docker:logs:api` - View API container logs only
- `npm run docker:restart` - Restart all services
- `npm run seed` - Run database seeds (inside container: `npm run docker:run:seed`)

### Testing in Docker
- `npm run docker:exec:test` - Run tests inside container
- `npm run docker:exec:test:cov` - Run tests with coverage inside container
- `npm run docker:exec:lint` - Run linting inside container
- `npm run docker:exec:build` - Build application inside container

## Architecture Overview

This is a **NestJS REST API** following **SOLID principles** and **Clean Architecture** patterns for a book store management system.

### Core Architecture Patterns

#### SOLID-Compliant Module Structure
Each business module follows a strict SOLID architecture:

```
src/modules/[module-name]/
├── controllers/           # HTTP endpoints (SRP: only handle requests/responses)
├── services/             # Business logic layer (segregated by responsibility)
│   ├── [module]-crud.service.ts      # CRUD operations
│   ├── [module]-search.service.ts    # Search operations
│   ├── error-handler.service.ts      # Error handling
│   ├── user-context.service.ts       # User context extraction
│   └── validation.service.ts         # Business validation rules
├── repositories/         # Data access layer
│   ├── [module]-crud.repository.ts   # CRUD data operations
│   └── [module]-search.repository.ts # Search data operations
├── interfaces/           # Contracts (ISP: segregated by responsibility)
│   ├── [module]-crud.repository.interface.ts
│   ├── [module]-search.repository.interface.ts
│   ├── [module]-crud.service.interface.ts
│   └── [module]-search.service.interface.ts
├── dto/                 # Data transfer objects
├── entities/            # TypeORM entities
└── decorators/          # Swagger API documentation decorators
```

#### Key Architectural Principles

1. **Dependency Inversion (DIP)**: All dependencies are injected via interfaces, never concrete classes
2. **Interface Segregation (ISP)**: Services and repositories implement specific, focused interfaces
3. **Single Responsibility (SRP)**: Each service class has one clear responsibility
4. **Repository Pattern**: Data access is abstracted through repository interfaces
5. **Service Layer Pattern**: Business logic is centralized in service classes

#### Service Segregation Pattern
Instead of monolithic services, each module uses specialized services:
- **CrudService**: Handles Create, Read, Update, Delete operations
- **SearchService**: Handles search and filtering operations  
- **ValidationService**: Handles business rule validation
- **ErrorHandlerService**: Centralized error handling and logging
- **UserContextService**: Extracts user information from requests

### Business Modules

1. **Authentication & Authorization** (`auth/`, `users/`)
   - JWT-based authentication
   - Role-based access control (RBAC)
   - User management with encrypted passwords

2. **Book Management** (`book-catalog/`, `book-authors/`, `book-genres/`, `publishing-houses/`)
   - Book catalog with metadata (ISBN, title, publication details)
   - Author management and book-author relationships
   - Genre categorization system
   - Publishing house information

3. **Book-Author Assignments** (`book-author-assignments/`)
   - Many-to-many relationship management between books and authors
   - Assignment validation and conflict resolution

4. **Audit System** (`audit/`)
   - Comprehensive audit logging for all CRUD operations
   - User action tracking with timestamps
   - Search and filtering capabilities for audit logs

### Database & Infrastructure

- **Database**: PostgreSQL with TypeORM ORM
- **Containerization**: Docker with docker-compose for development
- **API Documentation**: Swagger/OpenAPI at `/apidoc`
- **Global Interceptors**: Logging, audit trail, response formatting
- **Global Guards**: JWT authentication, role-based authorization

### Key Implementation Patterns

#### Error Handling
Uses centralized error handling service in each module:
```typescript
await this.errorHandler.handleError(error, ERROR_MESSAGES.FAILED_TO_CREATE);
```

#### Validation
Business validation is delegated to validation services:
```typescript
await this.validationService.validateUniqueConstraints(dto, id, constraints, this.repository);
```

#### User Context
User information extraction is standardized:
```typescript
const userId = this.userContextService.extractUserId(req);
```

#### Audit Integration  
All CRUD operations automatically generate audit logs through interceptors.

## Development Guidelines

### When Adding New Modules
1. Follow the SOLID module structure template shown above
2. Implement segregated interfaces for each responsibility
3. Use dependency injection with interface abstractions
4. Include comprehensive Swagger documentation decorators
5. Add proper error handling using the ErrorHandlerService pattern
6. Implement validation using the ValidationService pattern

### Before Committing Changes
Always run these commands to ensure code quality:
```bash
npm run build          # Must compile without errors
npm run lint           # Must pass without violations  
npm run test:cov       # Maintain >80% test coverage
```

### Common Validation Commands
```bash
# Run full validation pipeline
npm run build && npm run lint && npm run test:cov

# Using Docker (when containers are running)
npm run docker:exec:build && npm run docker:exec:lint && npm run docker:exec:test:cov
```

## Environment Setup

The application uses environment variables defined in `.env` (copy from `.env.example`):
- Database connection settings
- JWT configuration  
- CORS settings
- Application port configuration

## Documentation References

- See `SOLID_MODULE_VALIDATION_GUIDE.md` for detailed SOLID compliance validation
- Swagger API documentation available at `http://localhost:3000/apidoc`
- Complete setup instructions in `README.md`