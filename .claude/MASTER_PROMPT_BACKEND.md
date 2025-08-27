# API Master Prompt - Backend BOOK-STORE (NestJS + TypeScript)

## INDEX_TAGS

<!-- ARCHITECTURE_OVERVIEW -->
<!-- PROJECT_STRUCTURE -->
<!-- AUTH_MODULE -->
<!-- USERS_MODULE -->
<!-- ROLES_MODULE -->
<!-- AUDIT_MODULE -->
<!-- COMMON_MODULE -->
<!-- ENTITY_PATTERNS -->
<!-- REPOSITORY_PATTERNS -->
<!-- BASE_REPOSITORY -->
<!-- CRUD_OPERATIONS -->
<!-- VALIDATION_PATTERNS -->
<!-- SERVICE_PATTERNS -->
<!-- UTILITY_PATTERNS -->
<!-- API_PATTERNS -->
<!-- TESTING_PATTERNS -->
<!-- PAGINATION_PATTERNS -->
<!-- SECURITY_PATTERNS -->
<!-- FAKER_MOCKS -->

---

## <!-- ARCHITECTURE_OVERVIEW --> Architecture Overview

Backend construido en **NestJS con TypeScript**, siguiendo principios **SOLID** y arquitectura modular, orientado a escalabilidad y mantenibilidad.

### Principios Clave

- **SOLID**: Cada clase con una única responsabilidad, uso de interfaces y dependencias invertidas.
- **Modularidad**: Separación clara entre módulos (`auth`, `users`, `roles`, `audit`).
- **Seguridad**: Autenticación JWT con `Passport`, guards basados en roles, validaciones estrictas.
- **Mantenibilidad**: Uso de `index.ts` para exports centralizados, documentación completa en entities.
- **Auditoría**: Sistema completo de logging con interceptores y entidad AuditLog.
- **Extensibilidad**: CRUD y validaciones desacopladas, repositorios con lógica de negocio.
- **Base de Datos**: PostgreSQL con TypeORM, soft deletes, índices optimizados.
- **Paginación**: Soporte completo de paginación en todas las consultas GET.
- **Validaciones**: Class-validator con validaciones a nivel de entidad y DTO.
- **Testing**: Cobertura completa con Jest para servicios críticos.
- **Mocks**: Uso de `faker` para generación de datos fakes en tests.
- **Transformaciones**: Hooks Before/After para normalización de datos.

### Flujo de Dependencias

```
Controllers → Services → Repositories (Business Logic) → Private CRUD → Entities → Database
                     ↓
               AuditLogService → AuditLogRepository
```

### Arquitectura de Repositorios

- **Métodos Públicos**: Funciones con nombre semántico (ej: `registerUser`, `authenticateUser`)
- **Métodos Privados**: CRUD básico con prefijo `_` (ej: `_createUser`, `_findById`)
- **Validaciones**: En métodos públicos antes de llamar a CRUD
- **Manejo de Errores**: HttpException consistente en toda la aplicación

---

## <!-- PROJECT_STRUCTURE --> Project Structure

```
src/
├── common/
│   ├── decorators/           # Decorators globales
│   │   ├── roles.decorator.ts
│   │   ├── auth.decorator.ts
│   │   └── index.ts
│   ├── dto/                  # DTOs globales
│   │   ├── pagination.dto.ts
│   │   └── index.ts
│   ├── guards/               # Guards globales
│   │   ├── jwt-auth.guard.ts
│   │   ├── roles.guard.ts
│   │   └── index.ts
│   ├── strategies/           # Passport strategies
│   │   ├── jwt.strategy.ts
│   │   ├── local.strategy.ts
│   │   └── index.ts
│   ├── repositories/         # Base repository classes
│   │   ├── base.repository.ts
│   │   └── index.ts
│   ├── mocks/                # Faker mocks por entidad
│   │   ├── user.mock.ts
│   │   ├── role.mock.ts
│   │   ├── audit-log.mock.ts
│   │   └── index.ts
│   ├── exceptions/
│   │   ├── business.exception.ts
│   │   └── index.ts
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   ├── audit.interceptor.ts
│   │   └── index.ts
│   ├── pipes/
│   │   ├── parse-id.pipe.ts
│   │   └── index.ts
│   ├── interfaces/           # Interfaces globales
│   │   ├── paginated-result.interface.ts
│   │   └── index.ts
│   └── utils/
│       ├── password.util.ts
│       ├── csv-export.util.ts
│       └── index.ts
│
├── config/
│   ├── database.config.ts
│   └── jwt.config.ts
│
├── database/
│   └── seeds/
│       ├── user.seed.ts
│       ├── role.seed.ts
│       └── run-seeds.ts
│
├── modules/
│   ├── auth/                 # Autenticación JWT
│   │   ├── __tests__/
│   │   │   └── auth.service.spec.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   │   └── index.ts
│   │   ├── interfaces/
│   │   │   └── auth.service.interface.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── auth.module.ts
│   │
│   ├── users/                # Gestión usuarios
│   │   ├── __tests__/
│   │   │   ├── user.service.spec.ts
│   │   │   └── user.controller.spec.ts
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   │   └── index.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── interfaces/
│   │   │   ├── user.repository.interface.ts
│   │   │   └── index.ts
│   │   ├── repositories/
│   │   │   └── user.repository.ts
│   │   ├── services/
│   │   │   └── user.service.ts
│   │   ├── users.controller.ts
│   │   └── users.module.ts
│   │
│   ├── roles/                # Gestión roles (relacionado con users)
│   │   ├── __tests__/
│   │   │   └── role.service.spec.ts
│   │   ├── dto/
│   │   │   ├── create-role.dto.ts
│   │   │   ├── update-role.dto.ts
│   │   │   └── index.ts
│   │   ├── entities/
│   │   │   └── role.entity.ts
│   │   ├── interfaces/
│   │   │   ├── role.repository.interface.ts
│   │   │   └── index.ts
│   │   ├── repositories/
│   │   │   └── role.repository.ts
│   │   ├── services/
│   │   │   └── role.service.ts
│   │   ├── roles.controller.ts
│   │   └── roles.module.ts
│   │
│   └── audit/               # Auditoría obligatoria
│       ├── __tests__/
│       │   └── audit-log.service.spec.ts
│       ├── dto/
│       │   └── audit-query.dto.ts
│       ├── entities/
│       │   └── audit-log.entity.ts
│       ├── interfaces/
│       │   ├── audit-log.repository.interface.ts
│       │   └── index.ts
│       ├── repositories/
│       │   └── audit-log.repository.ts
│       ├── services/
│       │   └── audit-log.service.ts
│       ├── audit.controller.ts
│       └── audit.module.ts
│
├── app.module.ts
└── main.ts
```

---

## <!-- AUTH_MODULE --> Auth Module (JWT + Roles)

Módulo estándar de autenticación con **JWT**, roles y auditoría automática.

### Estructura Estándar

```
auth/
├── dto/
│   ├── login.dto.ts
│   └── index.ts
├── services/
│   └── auth.service.ts
├── auth.controller.ts
├── auth.module.ts
├── jwt-auth.guard.ts
├── jwt.strategy.ts
├── roles.decorator.ts
└── roles.guard.ts
```

### Implementación de Referencia

#### auth.service.ts

```ts
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    // Auto-audit logging
    await this.auditLogService.logOperation(user.id, user.id, AuditAction.LOGIN, `User logged in: ${user.username}`, "Auth");

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getProfile(userId: string): Promise<User> {
    return this.userService.findById(userId);
  }
}
```

#### auth.controller.ts

```ts
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.authService.login(user);
  }

  @Post("register")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async register(@Body() createUserDto: CreateUserDto, @Request() req) {
    const user = await this.userService.create(createUserDto, req.user.userId);
    return {
      message: "User created successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const user = await this.authService.getProfile(req.user.userId);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
```

---

## <!-- USERS_MODULE --> Users Module (Ejemplo Completo)

Ejemplo completo de implementación siguiendo todos los patrones establecidos.

### Estructura Completa

```
users/
├── dto/
│   ├── create-user.dto.ts
│   ├── update-user.dto.ts
│   └── index.ts
├── entities/
│   └── user.entity.ts (UUID, indices, hooks)
├── interfaces/
│   ├── user.repository.interface.ts
│   └── index.ts
├── repositories/
│   └── user.repository.ts (business methods)
├── services/
│   └── user.service.ts
├── __tests__/
│   ├── mocks/
│   │   └── user.mock.ts
│   ├── user.service.spec.ts
│   └── users.controller.spec.ts
├── users.controller.ts
└── users.module.ts
```

### user.entity.ts (Ejemplo Completo)

```ts
@Entity("users")
@Index(["username"], { unique: true, where: "deleted_at IS NULL" })
@Index(["email"], { unique: true, where: "deleted_at IS NULL" })
@Index(["role"])
@Index(["created_at"])
export class User {
  @PrimaryGeneratedColumn("uuid", {
    comment: "Primary key identifier for user",
  })
  id: string;

  @Column({
    name: "username",
    type: "varchar",
    length: 50,
    unique: true,
    nullable: false,
    comment: "Unique username for authentication",
  })
  username: string;

  @Column({
    name: "password",
    type: "varchar",
    length: 255,
    nullable: false,
    comment: "Encrypted password for authentication",
  })
  password: string;

  @Column({
    name: "email",
    type: "varchar",
    length: 100,
    unique: true,
    nullable: false,
    comment: "Unique email address for user",
  })
  email: string;

  @Column({
    name: "role",
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
    nullable: false,
    comment: "User role for authorization (admin, user)",
  })
  role: UserRole;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    comment: "Timestamp when user was created",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
    comment: "Timestamp when user was last updated",
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: "deleted_at",
    type: "timestamp",
    nullable: true,
    comment: "Timestamp when user was soft deleted",
  })
  deletedAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith("$2b$")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  normalizeUsername() {
    if (this.username) {
      this.username = this.username.toLowerCase().trim();
    }
  }
}
```

### user.repository.ts (Ejemplo Completo)

```ts
@Injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  // ========== MÉTODOS PÚBLICOS (BUSINESS LOGIC) ==========

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Validaciones de negocio específicas
      await this._validateUniqueConstraints(createUserDto);

      // Usar método heredado de BaseRepository
      return await this._createEntity(createUserDto);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Failed to register user", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllUsers(pagination: PaginationDto): Promise<PaginatedResult<User>> {
    try {
      const options: FindManyOptions<User> = {
        where: { deletedAt: null },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      // Usar método heredado de BaseRepository
      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Failed to get all users", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserProfile(id: string): Promise<User> {
    try {
      const user = await this._findById(id);
      if (!user) {
        throw new NotFoundException("User not found");
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Failed to get user profile", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUserProfile(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      await this._updateEntity(id, updateUserDto);
      return await this.getUserProfile(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Failed to update user profile", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deactivateUser(id: string): Promise<void> {
    try {
      await this._softDelete(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Failed to deactivate user", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
```

---

## <!-- AUDIT_MODULE --> Audit Module

Módulo de auditoría para trazabilidad completa.

---

## <!-- ROLES_MODULE --> Roles Module

Sistema de roles relacionado con usuarios para autorización granular.

### role.entity.ts

```ts
@Entity("roles")
@Index(["name"], { unique: true, where: "deleted_at IS NULL" })
@Index(["created_at"])
export class Role {
  @PrimaryGeneratedColumn("uuid", {
    comment: "Primary key identifier for role",
  })
  id: string;

  @Column({
    name: "name",
    type: "varchar",
    length: 50,
    unique: true,
    nullable: false,
    comment: "Role name (ADMIN, USER, MANAGER, etc.)",
  })
  name: string;

  @Column({
    name: "description",
    type: "text",
    nullable: true,
    comment: "Role description and permissions",
  })
  description?: string;

  @Column({
    name: "permissions",
    type: "jsonb",
    nullable: true,
    comment: "Permissions array for role",
  })
  permissions?: string[];

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    comment: "Role creation timestamp",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    comment: "Role last update timestamp",
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: "timestamp",
    nullable: true,
    comment: "Soft delete timestamp",
  })
  deletedAt?: Date;

  // Relations
  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @BeforeInsert()
  beforeInsert() {
    this.name = this.name.toUpperCase();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.name = this.name.toUpperCase();
  }
}
```

### create-role.dto.ts

```ts
export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}
```

---

## <!-- ENTITY_PATTERNS --> Entity Patterns (Estándares TypeORM)

Patrones obligatorios para todas las entidades.

### Documentación Completa

```ts
@Entity("table_name")
@Index(["field1"], { unique: true, where: "deleted_at IS NULL" })
@Index(["field2"])
export class EntityName {
  @PrimaryGeneratedColumn("uuid", {
    comment: "Description of primary key",
  })
  id: string;

  @Column({
    name: "field_name",
    type: "varchar",
    length: 100,
    unique: true,
    nullable: false,
    comment: "Detailed field description",
  })
  fieldName: string;
}
```

### Índices Requeridos

- **Unique indices**: Para campos únicos con condición `deleted_at IS NULL`
- **Query indices**: Para campos usados frecuentemente en WHERE/ORDER BY
- **Composite indices**: Para consultas con múltiples condiciones

### Hooks de Transformación

```ts
@BeforeInsert()
@BeforeUpdate()
async hashSensitiveData() {
  if (this.password && !this.password.startsWith('$2b$')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
}

@BeforeInsert()
@BeforeUpdate()
normalizeData() {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
}
```

### Validaciones Class-Validator

```ts
@Column({ name: 'email' })
email: string;

@Column({ name: 'password' })
password: string;
```

---

## <!-- REPOSITORY_PATTERNS --> Repository Patterns (Business Logic)

Arquitectura de repositorios con separación clara de responsabilidades.

### Estructura Obligatoria

```ts
@Injectable()
export class EntityRepository implements IEntityRepository {
  // ========== MÉTODOS PÚBLICOS (BUSINESS LOGIC) ==========

  async businessMethodName(params): Promise<ReturnType> {
    try {
      // 1. Validaciones de negocio
      await this._validateBusinessRules(params);

      // 2. Llamada a métodos privados CRUD
      const result = await this._privateMethod(params);

      // 3. Retorno del resultado
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Business error message", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ========== MÉTODOS PRIVADOS (CRUD) ==========

  private async _createEntity(data): Promise<Entity> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  private async _findById(id: string): Promise<Entity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  private async _findManyWithPagination(options: FindManyOptions<Entity>, pagination: PaginationDto): Promise<PaginatedResult<Entity>> {
    const [data, total] = await this.repository.findAndCount(options);

    return {
      data,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
        hasNext: pagination.page < Math.ceil(total / pagination.limit),
        hasPrev: pagination.page > 1,
      },
    };
  }
}
```

### Nombres de Métodos Semánticos

- `registerUser()` en lugar de `create()`
- `authenticateUser()` en lugar de `findByUsername()`
- `deactivateUser()` en lugar de `softDelete()`
- `getUsersByRole()` en lugar de `findByRole()`

### Manejo de Errores Obligatorio

```ts
try {
  // Business logic
} catch (error) {
  if (error instanceof HttpException) {
    throw error; // Re-throw known exceptions
  }
  throw new HttpException("Descriptive error message", HttpStatus.INTERNAL_SERVER_ERROR);
}
```

---

## <!-- BASE_REPOSITORY --> Base Repository (Evitar repetir lógica)

Clase base para extender en todos los repositorios y evitar duplicación de métodos privados.

### base.repository.ts

```ts
import { Repository, FindManyOptions } from "typeorm";
import { HttpException, HttpStatus, ConflictException } from "@nestjs/common";
import { PaginationDto, PaginatedResult } from "../dto/pagination.dto";

export abstract class BaseRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  // ========== MÉTODOS PRIVADOS COMUNES ==========

  protected async _createEntity(data: Partial<T>): Promise<T> {
    try {
      const entity = this.repository.create(data);
      return await this.repository.save(entity);
    } catch (error) {
      throw new HttpException("Failed to create entity", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _findById(id: string): Promise<T | null> {
    try {
      return await this.repository.findOne({ where: { id } as any });
    } catch (error) {
      throw new HttpException("Failed to find entity", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _findOne(options: any): Promise<T | null> {
    try {
      return await this.repository.findOne(options);
    } catch (error) {
      throw new HttpException("Failed to find entity", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _findMany(options: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.repository.find(options);
    } catch (error) {
      throw new HttpException("Failed to find entities", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _findManyWithPagination(options: FindManyOptions<T>, pagination: PaginationDto): Promise<PaginatedResult<T>> {
    try {
      const [data, total] = await this.repository.findAndCount(options);

      const totalPages = Math.ceil(total / pagination.limit);

      return {
        data,
        meta: {
          total,
          page: pagination.page,
          limit: pagination.limit,
          totalPages,
          hasNext: pagination.page < totalPages,
          hasPrev: pagination.page > 1,
        },
      };
    } catch (error) {
      throw new HttpException("Failed to find entities with pagination", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _updateEntity(id: string, data: Partial<T>): Promise<void> {
    try {
      await this.repository.update({ id } as any, data);
    } catch (error) {
      throw new HttpException("Failed to update entity", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _softDelete(id: string): Promise<void> {
    try {
      await this.repository.softDelete({ id } as any);
    } catch (error) {
      throw new HttpException("Failed to delete entity", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _count(options?: FindManyOptions<T>): Promise<number> {
    try {
      return await this.repository.count(options);
    } catch (error) {
      throw new HttpException("Failed to count entities", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _exists(options: any): Promise<boolean> {
    try {
      const count = await this.repository.count(options);
      return count > 0;
    } catch (error) {
      throw new HttpException("Failed to check entity existence", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _validateUniqueConstraints(uniqueFields: Partial<T>): Promise<void> {
    const whereConditions = Object.entries(uniqueFields).map(([key, value]) => ({
      [key]: value,
      deletedAt: null, // opcional, si manejas soft delete
    }));

    const existing = await this._findOne({ where: whereConditions });

    if (existing) {
      throw new ConflictException(`Entity with ${Object.keys(uniqueFields).join(", ")} already exists`);
    }
  }
}
```

### Uso en Repositorios Específicos

```ts
@Injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  // ========== MÉTODOS PÚBLICOS (BUSINESS LOGIC) ==========

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Validaciones de negocio
      await this._validateUniqueConstraints(createUserDto);

      // Usar método base heredado
      return await this._createEntity(createUserDto);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Failed to register user", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserProfile(id: string): Promise<User> {
    try {
      const user = await this._findById(id);
      if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Failed to get user profile", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllUsers(pagination: PaginationDto): Promise<PaginatedResult<User>> {
    try {
      const options: FindManyOptions<User> = {
        where: { deletedAt: null },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Failed to get all users", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
```

### Beneficios del BaseRepository

- **DRY**: No repetir métodos CRUD en cada repository
- **Consistencia**: Manejo de errores uniforme
- **Mantenibilidad**: Cambios centralizados en la clase base
- **Tipado**: TypeScript garantiza type safety
- **Extensibilidad**: Fácil agregar nuevos métodos base

---

## <!-- PAGINATION_PATTERNS --> Pagination Patterns

Paginación obligatoria en todas las consultas GET.

### PaginationDto Estándar

```ts
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @Type(() => String)
  sortBy?: string = "createdAt";

  @IsOptional()
  @IsIn(["ASC", "DESC"])
  sortOrder?: "ASC" | "DESC" = "DESC";

  get offset(): number {
    return (this.page - 1) * this.limit;
  }
}
```

### PaginatedResult Interface

```ts
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

### Uso en Controllers

```ts
@Get()
async findAll(@Query() pagination: PaginationDto) {
  return this.service.findAll(pagination);
}
```

### Implementación en Repositories

```ts
async getAllEntities(pagination: PaginationDto): Promise<PaginatedResult<Entity>> {
  const options: FindManyOptions<Entity> = {
    order: { [pagination.sortBy]: pagination.sortOrder },
    skip: pagination.offset,
    take: pagination.limit,
  };

  return await this._findManyWithPagination(options, pagination);
}
```

---

## <!-- SECURITY_PATTERNS --> Security Patterns

Patrones de seguridad implementados en toda la aplicación.

### Guards en Cascada

```ts
@Controller("protected-resource")
@UseGuards(JwtAuthGuard) // 1. Autenticación
export class ProtectedController {
  @Get("admin-only")
  @Roles(UserRole.ADMIN) // 2. Roles
  @UseGuards(RolesGuard) // 3. Autorización
  async adminEndpoint() {
    // Solo accesible por admins autenticados
  }

  @Put(":id")
  async updateOwn(@Param("id") id: string, @Request() req) {
    // 4. Validación de propiedad
    if (req.user.role !== UserRole.ADMIN && req.user.userId !== id) {
      throw new ForbiddenException("Access denied");
    }
  }
}
```

### JWT Strategy Completa

```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
```

### Validación de Roles

```ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

---

## <!-- TESTING_PATTERNS --> Testing Patterns (Cobertura 80%+)

Patrones completos de testing con cobertura superior al 80%.

### Estructura de Testing Obligatoria

```
module/
├── __tests__/
│   ├── mocks/
│   │   ├── entity.mock.ts (faker data)
│   │   └── index.ts
│   ├── entity.service.spec.ts
│   ├── entity.controller.spec.ts
│   └── entity.repository.spec.ts (si aplica)
```

### Jest Configuration Completa

```js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/main.ts",
    "!src/**/*.module.ts",
    "!src/**/index.ts", // Excluir archivos de solo exportación
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
};
```

### Mock Patterns con Faker

#### entity.mock.ts

```ts
import { faker } from "@faker-js/faker";
import { User, UserRole } from "../entities/user.entity";

export class UserMockFactory {
  // Mock para 1 resultado
  static createOne(overrides?: Partial<User>): User {
    return {
      id: faker.string.uuid(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 }),
      role: faker.helpers.enumValue(UserRole),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      deletedAt: undefined,
      ...overrides,
    };
  }

  // Mock para múltiples resultados
  static createMany(count: number = 2, overrides?: Partial<User>): User[] {
    return Array.from({ length: count }, () => this.createOne(overrides));
  }

  // Mock sin relaciones (para entidades complejas)
  static createWithoutRelations(overrides?: Partial<User>): User {
    const user = this.createOne(overrides);
    // Remover propiedades de relación si existen
    delete user.posts; // Ejemplo: si User tuviera relación con Post
    return user;
  }

  // Mock con relaciones opcionales
  static createWithOptionalRelations(overrides?: Partial<User>): User {
    const user = this.createOne(overrides);
    // Agregar relaciones opcionales si se requieren
    user.profile = Math.random() > 0.5 ? ProfileMockFactory.createOne() : null;
    return user;
  }

  // Mock para admin
  static createAdmin(overrides?: Partial<User>): User {
    return this.createOne({
      role: UserRole.ADMIN,
      username: "admin",
      email: "admin@test.com",
      ...overrides,
    });
  }

  // Mock para usuario regular
  static createRegularUser(overrides?: Partial<User>): User {
    return this.createOne({
      role: UserRole.USER,
      ...overrides,
    });
  }

  // Mock para usuario eliminado (soft delete)
  static createDeletedUser(overrides?: Partial<User>): User {
    return this.createOne({
      deletedAt: faker.date.recent(),
      ...overrides,
    });
  }
}

export const userMockData = {
  singleUser: UserMockFactory.createOne(),
  multipleUsers: UserMockFactory.createMany(3),
  adminUser: UserMockFactory.createAdmin(),
  regularUser: UserMockFactory.createRegularUser(),
  deletedUser: UserMockFactory.createDeletedUser(),
};
```

### Service Testing Pattern

```ts
import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { UserService } from "../user.service";
import { IUserRepository } from "../interfaces/user.repository.interface";
import { AuditLogService } from "../../audit/services/audit-log.service";
import { UserMockFactory, userMockData } from "./mocks/user.mock";

describe("UserService", () => {
  let service: UserService;
  let userRepository: jest.Mocked<IUserRepository>;
  let auditLogService: jest.Mocked<AuditLogService>;

  beforeEach(async () => {
    const mockUserRepository = {
      registerUser: jest.fn(),
      authenticateUser: jest.fn(),
      getUserProfile: jest.fn(),
      updateUserProfile: jest.fn(),
      deactivateUser: jest.fn(),
      getAllUsers: jest.fn(),
      checkUsernameExists: jest.fn(),
      checkEmailExists: jest.fn(),
    };

    const mockAuditLogService = {
      logOperation: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: "IUserRepository",
          useValue: mockUserRepository,
        },
        {
          provide: AuditLogService,
          useValue: mockAuditLogService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get("IUserRepository");
    auditLogService = module.get(AuditLogService);
  });

  describe("create", () => {
    const createUserDto = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      role: "user" as any,
    };

    it("should create a user successfully", async () => {
      const mockUser = UserMockFactory.createOne(createUserDto);
      userRepository.registerUser.mockResolvedValue(mockUser);
      auditLogService.logOperation.mockResolvedValue({} as any);

      const result = await service.create(createUserDto, "admin123");

      expect(userRepository.registerUser).toHaveBeenCalledWith(createUserDto);
      expect(auditLogService.logOperation).toHaveBeenCalledWith(
        "admin123",
        mockUser.id,
        expect.any(String),
        expect.stringContaining(mockUser.username),
        "User",
      );
      expect(result).toEqual(mockUser);
    });

    it("should handle repository errors", async () => {
      userRepository.registerUser.mockRejectedValue(new ConflictException("Username already exists"));

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(auditLogService.logOperation).not.toHaveBeenCalled();
    });

    it("should work without audit logging", async () => {
      const mockUser = UserMockFactory.createOne(createUserDto);
      userRepository.registerUser.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(auditLogService.logOperation).not.toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should return user when found", async () => {
      const mockUser = userMockData.singleUser;
      userRepository.getUserProfile.mockResolvedValue(mockUser);

      const result = await service.findById(mockUser.id);

      expect(userRepository.getUserProfile).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it("should handle not found cases", async () => {
      userRepository.getUserProfile.mockRejectedValue(new NotFoundException("User not found"));

      await expect(service.findById("nonexistent")).rejects.toThrow(NotFoundException);
    });
  });

  describe("findAll", () => {
    it("should return paginated users", async () => {
      const mockUsers = UserMockFactory.createMany(3);
      const paginationDto = { page: 1, limit: 10, sortBy: "createdAt", sortOrder: "DESC" as any };
      const mockResult = {
        data: mockUsers,
        meta: {
          total: 3,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

      userRepository.getAllUsers.mockResolvedValue(mockResult);

      const result = await service.findAll(paginationDto);

      expect(userRepository.getAllUsers).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual(mockResult);
      expect(result.data).toHaveLength(3);
    });
  });

  // Pruebas adicionales para cobertura completa
  describe("edge cases and error handling", () => {
    it("should handle service errors gracefully", async () => {
      userRepository.getUserProfile.mockRejectedValue(new Error("Database connection lost"));

      await expect(service.findById("test-id")).rejects.toThrow();
    });

    it("should validate input parameters", async () => {
      await expect(service.findById("")).rejects.toThrow();
      await expect(service.findById(null as any)).rejects.toThrow();
    });
  });
});
```

### Controller Testing Pattern

```ts
import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../auth.controller";
import { AuthService } from "../services/auth.service";
import { UserService } from "../../users/services/user.service";
import { UnauthorizedException } from "@nestjs/common";
import { UserMockFactory } from "../../users/__tests__/mocks/user.mock";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const mockAuthService = {
      validateUser: jest.fn(),
      login: jest.fn(),
      getProfile: jest.fn(),
    };

    const mockUserService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    userService = module.get(UserService);
  });

  describe("POST /login", () => {
    const loginDto = { username: "testuser", password: "password123" };

    it("should login successfully with valid credentials", async () => {
      const mockUser = UserMockFactory.createRegularUser();
      const mockLoginResult = {
        access_token: "jwt-token",
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
        },
      };

      authService.validateUser.mockResolvedValue(mockUser);
      authService.login.mockResolvedValue(mockLoginResult);

      const result = await controller.login(loginDto);

      expect(authService.validateUser).toHaveBeenCalledWith(loginDto.username, loginDto.password);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockLoginResult);
      expect(result.access_token).toBeDefined();
    });

    it("should throw UnauthorizedException with invalid credentials", async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(authService.login).not.toHaveBeenCalled();
    });

    it("should handle service errors", async () => {
      authService.validateUser.mockRejectedValue(new Error("Database error"));

      await expect(controller.login(loginDto)).rejects.toThrow();
    });
  });

  describe("POST /register", () => {
    const registerDto = {
      username: "newuser",
      email: "new@example.com",
      password: "password123",
      role: "user" as any,
    };

    it("should register user successfully", async () => {
      const mockUser = UserMockFactory.createOne(registerDto);
      userService.create.mockResolvedValue(mockUser);

      const result = await controller.register(registerDto);

      expect(userService.create).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
      });
    });

    it("should handle registration conflicts", async () => {
      userService.create.mockRejectedValue(new ConflictException("Username already exists"));

      await expect(controller.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe("GET /profile", () => {
    it("should return user profile", async () => {
      const mockUser = UserMockFactory.createRegularUser();
      const req = { user: { userId: mockUser.id } };
      authService.getProfile.mockResolvedValue(mockUser);

      const result = await controller.getProfile(req);

      expect(authService.getProfile).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it("should handle profile not found", async () => {
      const req = { user: { userId: "nonexistent" } };
      authService.getProfile.mockRejectedValue(new NotFoundException("User not found"));

      await expect(controller.getProfile(req)).rejects.toThrow(NotFoundException);
    });
  });
});
```

### Repository Testing Pattern

```ts
import { Test, TestingModule } from "@nestjs/testing";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../user.repository";
import { User, UserRole } from "../../entities/user.entity";
import { UserMockFactory, userMockData } from "../mocks/user.mock";

describe("UserRepository", () => {
  let repository: UserRepository;
  let mockRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    mockRepository = module.get(getRepositoryToken(User));
  });

  describe("registerUser", () => {
    const createUserDto = {
      username: "testuser",
      email: "test@example.com",
      password: "hashedpassword",
      role: UserRole.USER,
    };

    it("should register user successfully", async () => {
      const mockUser = UserMockFactory.createOne(createUserDto);
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await repository.registerUser(createUserDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it("should handle duplicate username", async () => {
      mockRepository.create.mockReturnValue({} as User);
      mockRepository.save.mockRejectedValue({ code: "23505" }); // PostgreSQL unique violation

      await expect(repository.registerUser(createUserDto)).rejects.toThrow("Failed to register user");
    });
  });

  describe("getUserProfile", () => {
    it("should return user profile", async () => {
      const mockUser = userMockData.singleUser;
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await repository.getUserProfile(mockUser.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id, deletedAt: null },
      });
      expect(result).toEqual(mockUser);
    });

    it("should throw NotFoundException when user not found", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(repository.getUserProfile("nonexistent")).rejects.toThrow("Failed to get user profile");
    });
  });

  describe("getAllUsers", () => {
    it("should return paginated users", async () => {
      const mockUsers = UserMockFactory.createMany(3);
      const pagination = { page: 1, limit: 10, sortBy: "createdAt", sortOrder: "DESC" as any, offset: 0 };
      mockRepository.findAndCount.mockResolvedValue([mockUsers, 3]);

      const result = await repository.getAllUsers(pagination);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { deletedAt: null },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      });
      expect(result.data).toEqual(mockUsers);
      expect(result.meta.total).toBe(3);
      expect(result.meta.totalPages).toBe(1);
    });
  });
});
```

### Utils and Commons Testing Patterns

```ts
// src/common/__tests__/utils/password.util.spec.ts
import { hashPassword, comparePassword } from "../../utils/password.util";
import * as bcrypt from "bcrypt";

jest.mock("bcrypt");

describe("PasswordUtil", () => {
  const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  describe("hashPassword", () => {
    it("should hash password correctly", async () => {
      const plainPassword = "password123";
      const hashedPassword = "hashed_password";

      mockBcrypt.hash.mockResolvedValue(hashedPassword);

      const result = await hashPassword(plainPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
      expect(result).toBe(hashedPassword);
    });

    it("should handle hashing errors", async () => {
      mockBcrypt.hash.mockRejectedValue(new Error("Hash failed"));

      await expect(hashPassword("password")).rejects.toThrow("Hash failed");
    });
  });

  describe("comparePassword", () => {
    it("should return true for valid password", async () => {
      mockBcrypt.compare.mockResolvedValue(true);

      const result = await comparePassword("password", "hash");

      expect(bcrypt.compare).toHaveBeenCalledWith("password", "hash");
      expect(result).toBe(true);
    });

    it("should return false for invalid password", async () => {
      mockBcrypt.compare.mockResolvedValue(false);

      const result = await comparePassword("wrongpassword", "hash");

      expect(result).toBe(false);
    });
  });
});

// src/common/__tests__/validators/custom-validators.spec.ts
import { IsUniqueValidator } from "../../validators/is-unique.validator";
import { ValidationArguments } from "class-validator";

describe("IsUniqueValidator", () => {
  let validator: IsUniqueValidator;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findOne: jest.fn(),
    };
    validator = new IsUniqueValidator();
    (validator as any).repository = mockRepository;
  });

  it("should return true when value is unique", async () => {
    mockRepository.findOne.mockResolvedValue(null);
    const args: ValidationArguments = {
      value: "uniquevalue",
      property: "username",
      object: {},
      constraints: ["User", "username"],
      targetName: "User",
    };

    const result = await validator.validate("uniquevalue", args);

    expect(result).toBe(true);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { username: "uniquevalue" },
    });
  });

  it("should return false when value already exists", async () => {
    mockRepository.findOne.mockResolvedValue({ id: "123", username: "existinguser" });
    const args: ValidationArguments = {
      value: "existinguser",
      property: "username",
      object: {},
      constraints: ["User", "username"],
      targetName: "User",
    };

    const result = await validator.validate("existinguser", args);

    expect(result).toBe(false);
  });
});

// src/common/__tests__/dto/pagination.dto.spec.ts
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { PaginationDto } from "../../dto/pagination.dto";

describe("PaginationDto", () => {
  it("should accept valid pagination parameters", async () => {
    const dto = plainToClass(PaginationDto, {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "ASC",
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.offset).toBe(0);
  });

  it("should use default values", async () => {
    const dto = plainToClass(PaginationDto, {});

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(10);
    expect(dto.sortBy).toBe("createdAt");
    expect(dto.sortOrder).toBe("DESC");
  });

  it("should validate page constraints", async () => {
    const dto = plainToClass(PaginationDto, { page: 0 });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty("min");
  });

  it("should validate limit constraints", async () => {
    const dto = plainToClass(PaginationDto, { limit: 0 });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("should calculate offset correctly", () => {
    const dto = new PaginationDto();
    dto.page = 3;
    dto.limit = 15;

    expect(dto.offset).toBe(30);
  });
});
```

### Test Coverage Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "test:unit": "jest --testPathPattern=spec.ts",
    "test:integration": "jest --testPathPattern=integration.spec.ts",
    "test:coverage:ci": "jest --coverage --coverageReporters=lcov --watchAll=false"
  }
}
```

---

## <!-- FAKER_MOCKS --> Faker Mocks (Commons/Independent Files)

Mocks centralizados en `src/common/mocks/` con archivos independientes por entidad.

### src/common/mocks/user.mock.ts

```ts
import { faker } from "@faker-js/faker";
import { User, UserRole } from "../../modules/users/entities/user.entity";

export class UserMockFactory {
  // Mock para 1 resultado
  static createOne(overrides?: Partial<User>): User {
    return {
      id: faker.string.uuid(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 }),
      role: faker.helpers.enumValue(UserRole),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      deletedAt: undefined,
      ...overrides,
    };
  }

  // Mock para múltiples resultados
  static createMany(count: number = 2, overrides?: Partial<User>): User[] {
    return Array.from({ length: count }, () => this.createOne(overrides));
  }

  // Mock sin relaciones
  static createWithoutRelations(overrides?: Partial<User>): User {
    const user = this.createOne(overrides);
    return user;
  }

  // Mock para admin
  static createAdmin(overrides?: Partial<User>): User {
    return this.createOne({
      role: UserRole.ADMIN,
      username: "admin",
      email: "admin@test.com",
      ...overrides,
    });
  }

  // Mock para usuario regular
  static createRegularUser(overrides?: Partial<User>): User {
    return this.createOne({
      role: UserRole.USER,
      ...overrides,
    });
  }

  // Mock para usuario eliminado
  static createDeletedUser(overrides?: Partial<User>): User {
    return this.createOne({
      deletedAt: faker.date.recent(),
      ...overrides,
    });
  }
}

// Datos predefinidos para tests
export const userMockData = {
  singleUser: UserMockFactory.createOne(),
  multipleUsers: UserMockFactory.createMany(3),
  adminUser: UserMockFactory.createAdmin(),
  regularUser: UserMockFactory.createRegularUser(),
  deletedUser: UserMockFactory.createDeletedUser(),
};
```

### src/common/mocks/role.mock.ts

```ts
import { faker } from "@faker-js/faker";
import { Role } from "../../modules/roles/entities/role.entity";

export class RoleMockFactory {
  static createOne(overrides?: Partial<Role>): Role {
    return {
      id: faker.string.uuid(),
      name: faker.helpers.arrayElement(["ADMIN", "USER", "MANAGER", "VIEWER"]),
      description: faker.lorem.sentence(),
      permissions: faker.helpers.arrayElements(["read", "write", "delete", "admin"], 2),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      deletedAt: undefined,
      users: [],
      ...overrides,
    };
  }

  static createMany(count: number = 2, overrides?: Partial<Role>): Role[] {
    return Array.from({ length: count }, () => this.createOne(overrides));
  }

  static createAdminRole(overrides?: Partial<Role>): Role {
    return this.createOne({
      name: "ADMIN",
      description: "Administrator with full permissions",
      permissions: ["read", "write", "delete", "admin"],
      ...overrides,
    });
  }

  static createUserRole(overrides?: Partial<Role>): Role {
    return this.createOne({
      name: "USER",
      description: "Regular user with basic permissions",
      permissions: ["read"],
      ...overrides,
    });
  }
}

export const roleMockData = {
  singleRole: RoleMockFactory.createOne(),
  multipleRoles: RoleMockFactory.createMany(3),
  adminRole: RoleMockFactory.createAdminRole(),
  userRole: RoleMockFactory.createUserRole(),
};
```

### src/common/mocks/audit-log.mock.ts

```ts
import { faker } from "@faker-js/faker";
import { AuditLog, AuditAction } from "../../modules/audit/entities/audit-log.entity";

export class AuditLogMockFactory {
  static createOne(overrides?: Partial<AuditLog>): AuditLog {
    return {
      id: faker.string.uuid(),
      performedBy: faker.string.uuid(),
      entityId: faker.string.uuid(),
      action: faker.helpers.enumValue(AuditAction),
      details: faker.lorem.sentence(),
      entityType: faker.helpers.arrayElement(["User", "Role", "Product"]),
      createdAt: faker.date.recent(),
      ...overrides,
    };
  }

  static createMany(count: number = 2, overrides?: Partial<AuditLog>): AuditLog[] {
    return Array.from({ length: count }, () => this.createOne(overrides));
  }

  static createUserAction(userId: string, overrides?: Partial<AuditLog>): AuditLog {
    return this.createOne({
      performedBy: userId,
      entityType: "User",
      action: AuditAction.CREATE,
      details: `User ${userId} was created`,
      ...overrides,
    });
  }

  static createLoginAction(userId: string, overrides?: Partial<AuditLog>): AuditLog {
    return this.createOne({
      performedBy: userId,
      entityType: "User",
      action: AuditAction.LOGIN,
      details: `User ${userId} logged in`,
      ...overrides,
    });
  }
}

export const auditLogMockData = {
  singleLog: AuditLogMockFactory.createOne(),
  multipleLogs: AuditLogMockFactory.createMany(5),
  userCreateLog: AuditLogMockFactory.createUserAction("user-123"),
  loginLog: AuditLogMockFactory.createLoginAction("user-123"),
};
```

### src/common/mocks/index.ts

```ts
export * from "./user.mock";
export * from "./role.mock";
export * from "./audit-log.mock";

// Exportar todos los datos predefinidos
export { userMockData } from "./user.mock";
export { roleMockData } from "./role.mock";
export { auditLogMockData } from "./audit-log.mock";

// Exportar todas las factories
export { UserMockFactory } from "./user.mock";
export { RoleMockFactory } from "./role.mock";
export { AuditLogMockFactory } from "./audit-log.mock";
```

### Uso en Tests

```ts
// En cualquier test file
import { UserMockFactory, userMockData } from "../../../common/mocks";

// Usar factory methods
const mockUser = UserMockFactory.createRegularUser();
const mockUsers = UserMockFactory.createMany(3);

// Usar datos predefinidos
const singleUser = userMockData.singleUser;
const adminUser = userMockData.adminUser;
```

### Beneficios de Mocks Centralizados

- **Reutilización**: Mismo mock en todos los tests
- **Consistencia**: Estructura de datos uniforme
- **Mantenibilidad**: Cambios centralizados
- **Faker Integration**: Datos realistas y variables
- **Tipado**: TypeScript safety en tests
  email: mockUser.email,
  role: mockUser.role,
  createdAt: mockUser.createdAt,
  updatedAt: mockUser.updatedAt,
  });
  });
  });

  // Test para cobertura de guards y decorators
  describe('Protected endpoints', () => {
  it('should have proper guards and roles configured', () => {
  const registerMetadata = Reflect.getMetadata('roles', controller.register);
  const guards = Reflect.getMetadata('**guards**', controller.register);

        expect(registerMetadata).toBeDefined();
        expect(guards).toBeDefined();
      });

  });
  });

````

### Utils/Commons Testing Pattern

```ts
describe('CsvExportUtil', () => {
  describe('exportToCsv', () => {
    it('should convert array to CSV format', () => {
      const data = [
        { id: 1, name: 'John', email: 'john@test.com' },
        { id: 2, name: 'Jane', email: 'jane@test.com' },
      ];

      const result = CsvExportUtil.exportToCsv(data);

      expect(result).toContain('id,name,email');
      expect(result).toContain('1,John,john@test.com');
      expect(result).toContain('2,Jane,jane@test.com');
    });

    it('should handle empty arrays', () => {
      const result = CsvExportUtil.exportToCsv([]);
      expect(result).toBe('');
    });

    it('should handle arrays with different properties', () => {
      const data = [
        { id: 1, name: 'John' },
        { id: 2, email: 'jane@test.com' },
      ];

      const result = CsvExportUtil.exportToCsv(data);

      expect(result).toContain('id,name,email');
      expect(result).toContain('1,John,');
      expect(result).toContain('2,,jane@test.com');
    });
  });
});
````

### Coverage Requirements

- **Mínimo 80%** en todas las métricas (branches, functions, lines, statements)
- **Cobertura obligatoria**: Servicios, controladores, repositorios, utils críticos
- **Exclusiones permitidas**: Archivos `index.ts` de solo exportación, `main.ts`, archivos `*.module.ts`
- **Mocks obligatorios**: Con faker para datos realistas, múltiples escenarios (1 resultado, múltiples, con/sin relaciones)

### Test Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

---

## <!-- COMMON_MODULE --> Common Layer & Module Structure

### Standard Module Structure

Estructura estándar para todos los módulos del proyecto.

#### users.module.ts (Ejemplo Completo)

```ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { UserService } from "./services/user.service";
import { UserRepository } from "./repositories/user.repository";
import { User } from "./entities/user.entity";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuditModule],
  controllers: [UsersController],
  providers: [
    UserService,
    {
      provide: "IUserRepository",
      useClass: UserRepository,
    },
  ],
  exports: [UserService, "IUserRepository"],
})
export class UsersModule {}
```

#### auth.module.ts

```ts
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { JwtStrategy } from "../../common/strategies/jwt.strategy";
import { LocalStrategy } from "../../common/strategies/local.strategy";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "24h" },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

#### app.module.ts (Estructura Principal)

```ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { RolesModule } from "./modules/roles/roles.module";
import { AuditModule } from "./modules/audit/audit.module";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { AuditInterceptor } from "./common/interceptors/audit.interceptor";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: process.env.NODE_ENV === "development",
      logging: process.env.NODE_ENV === "development",
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    AuditModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
```

### Common Interceptors

#### logging.interceptor.ts

```ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        this.logger.log(`${method} ${url} ${responseTime}ms`);
      }),
    );
  }
}
```

### Common Decorators

#### roles.decorator.ts

```ts
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

#### auth.decorator.ts

```ts
import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "./roles.decorator";

export function Auth(...roles: string[]) {
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), Roles(...roles));
}
```

### index.ts pattern

```ts
// dto/index.ts
export * from "./create-role.dto";
export * from "./update-role.dto";
```

---

## <!-- CRUD_OPERATIONS --> CRUD Operations

- `POST /auth/login` → Autenticar usuario
- `POST /auth/register` → Registrar usuario
- `GET /users` → Listar usuarios (Admin)
- `GET /users/:id` → Obtener usuario
- `PUT /users/:id` → Actualizar usuario
- `DELETE /users/:id` → Eliminar usuario (Admin)
- `GET /audit` → Consultar logs de auditoría (Admin)

---


---

## <!-- SWAGGER_DTO_PATTERNS --> Swagger DTO & Enum Patterns

### DTOs con Swagger

Todos los DTOs deben estar decorados con `@ApiProperty` o `@ApiPropertyOptional`:

```ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ description: "Unique username for login", example: "john_doe" })
  username: string;

  @ApiProperty({ description: "User email address", example: "john@example.com" })
  email: string;

  @ApiProperty({ description: "User password", example: "Password123!" })
  password: string;

  @ApiPropertyOptional({ description: "User role", enum: UserRole, example: "USER" })
  role?: UserRole;
}
```

### Organización de Enums

Los enums deben mantenerse en la misma carpeta que los DTOs, interfaces y decoradores del módulo correspondiente:

```
modules/
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   │   └── index.ts
│   ├── enums/
│   │   ├── user-role.enum.ts
│   │   └── index.ts
│   ├── interfaces/
│   └── decorators/
```

### Ejemplo Enum

```ts
export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  MANAGER = "MANAGER",
}
```

### Estándares Requeridos

- Todos los DTOs deben estar documentados con `@ApiProperty` o `@ApiPropertyOptional`.
- Los enums deben exportarse desde `index.ts` en su carpeta correspondiente.
- Los controladores deben usar DTOs documentados para exponer schemas legibles en Swagger.

## <!-- VALIDATION_PATTERNS --> Validation Patterns

- DTOs con `class-validator`
- Pipes (`parse-id.pipe.ts`) para validaciones de parámetros

---

## <!-- SERVICE_PATTERNS --> Service Patterns

- Servicios inyectan **interfaces**, no implementaciones (DIP).
- Se pueden extender con hooks `beforeCreate`, `afterUpdate`.

---

## <!-- UTILITY_PATTERNS --> Utility Patterns

- Exportación CSV en `csv-export.util.ts`.
- Interceptor de logging global.

---

## <!-- API_PATTERNS --> API Patterns

Estructura estándar de respuesta:

```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {}
}
```

---
