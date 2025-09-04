# CLAUDE.md

Este archivo proporciona la guía completa para Claude Code (claude.ai/code) al trabajar con código en este repositorio.

## Comandos de Desarrollo

### Build & Desarrollo
- `npm run build` - Compilar TypeScript a JavaScript
- `npm run start:dev` - Iniciar servidor de desarrollo con hot reload
- `npm run start:debug` - Iniciar servidor de desarrollo con debugging
- `npm run start:prod` - Iniciar servidor de producción

### Testing
- `npm run test` - Ejecutar pruebas unitarias
- `npm run test:watch` - Ejecutar pruebas en modo watch
- `npm run test:cov` - Ejecutar pruebas con reporte de cobertura
- `npm run test:e2e` - Ejecutar pruebas end-to-end

### Calidad de Código
- `npm run lint` - Ejecutar ESLint para verificar calidad del código
- `npm run format` - Formatear código con Prettier

### Desarrollo con Docker
- `npm run docker:up:build` - Construir e iniciar todos los servicios
- `npm run docker:up` - Iniciar contenedores existentes
- `npm run docker:down` - Detener y eliminar contenedores
- `npm run docker:logs` - Ver logs de todos los servicios
- `npm run docker:logs:api` - Ver logs solo del contenedor API
- `npm run docker:restart` - Reiniciar todos los servicios

## ESTÁNDAR DE ARQUITECTURA UNIFICADA

### Arquitectura General
- **Framework**: NestJS REST API
- **Principios**: SOLID + Clean Architecture  
- **Patrón**: Servicio Unificado por módulo
- **Base de datos**: PostgreSQL con TypeORM

### REGLA FUNDAMENTAL: SERVICIOS USAN INTERFACES, NO DTOs

**PREMISA OBLIGATORIA**: Los servicios SIEMPRE procesan datos usando interfaces internas, NUNCA DTOs directamente.

#### Flujo Correcto:
1. **Controlador** → Recibe y valida **DTOs**
2. **Servicio** → Convierte DTOs a **interfaces internas** inmediatamente
3. **Procesamiento** → Usa solo **interfaces** para lógica de negocio
4. **Respuesta** → Retorna **interfaces tipadas**

#### Patrón de Conversión Obligatorio:
```typescript
async createUser(requestDto: CreateUserRequestDto, req: ExpressRequest): Promise<IUserResponse> {
  // ✅ OBLIGATORIO: Convertir DTO a interface inmediatamente
  const createUserRequest: ICreateUserRequest = {
    userData: {
      username: requestDto.userData.username,
      email: requestDto.userData.email,
      password: requestDto.userData.password,
      roleId: requestDto.userData.roleId,
    }
  };
  
  // ✅ CORRECTO: Procesar usando interface, NO DTO
  await this.validateUniqueConstraints(createUserRequest.userData);
  
  // ✅ El resto del método usa solo interfaces
}
```

## ESTRUCTURA OBLIGATORIA DE MÓDULO

Cada módulo DEBE seguir esta estructura exacta:

```
src/modules/[nombre-modulo]/
├── controllers/
│   └── [nombre-modulo].controller.ts       # OBLIGATORIO
├── services/
│   └── [nombre-modulo].service.ts          # OBLIGATORIO (singular)
├── repositories/
│   ├── [entidad]-crud.repository.ts        # OBLIGATORIO
│   └── [entidad]-search.repository.ts      # OBLIGATORIO
├── interfaces/
│   ├── [nombre]-request.interface.ts       # OPCIONAL
│   ├── [nombre]-response.interface.ts      # OPCIONAL
│   └── index.ts                           # Si existen interfaces
├── dto/
│   ├── [varios archivos].dto.ts           # OBLIGATORIO
│   └── index.ts                           # OBLIGATORIO
├── entities/
│   └── [entidad].entity.ts                # OBLIGATORIO
└── decorators/
    ├── [varios decoradores].decorator.ts   # OBLIGATORIO
    └── index.ts                           # OBLIGATORIO
```

## ESTÁNDAR CONTROLADOR

### Reglas Obligatorias del Controlador:

1. **Inyección Directa**: Inyectar servicio directamente, SIN interfaces
2. **Tipado ExpressRequest**: Todos los `@Request()` deben ser `ExpressRequest`
3. **Respuesta StandardResponseDto**: Todos los métodos retornan `StandardResponseDto<T>`
4. **Parámetros (dto, req)**: Siempre pasar `(dto, req)` al servicio

### Plantilla de Controlador:
```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  Query,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { [Entidad]Service } from '../services/[entidad].service';
import {
  Create[Entidad]RequestDto,
  GetAll[Entidades]Dto,
  Get[Entidad]ByIdDto,
  Update[Entidad]RequestDto,
  Delete[Entidad]RequestDto,
  [Entidad]DataDto,
  [Entidades]ListDataDto,
} from '../dto';
import { StandardResponseDto } from '../../../common/dto/paginated-response.dto';
import { Auth } from '../../../common/decorators/auth.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';
import {
  ApiCreate[Entidad],
  ApiGet[Entidades],
  ApiGet[Entidad]ById,
  ApiUpdate[Entidad],
  ApiDelete[Entidad],
} from '../decorators';

@ApiTags('[Entidades]')
@Controller('[entidades]')
export class [Entidades]Controller {
  constructor(private readonly [entidad]Service: [Entidad]Service) {} // ✅ Inyección directa

  @Post()
  @Auth(UserRole.ADMIN)
  @ApiCreate[Entidad]()
  async create(
    @Body() requestDto: Create[Entidad]RequestDto,
    @Request() req: ExpressRequest, // ✅ Tipado ExpressRequest
  ): Promise<StandardResponseDto<[Entidad]DataDto>> { // ✅ StandardResponseDto
    return this.[entidad]Service.create[Entidad](requestDto, req); // ✅ (dto, req)
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGet[Entidades]()
  async findAll(
    @Query() requestDto: GetAll[Entidades]Dto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<[Entidades]ListDataDto>> {
    return this.[entidad]Service.findAll[Entidades](requestDto, req);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGet[Entidad]ById()
  async findOne(
    @Param() requestDto: Get[Entidad]ByIdDto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<[Entidad]DataDto>> {
    return this.[entidad]Service.find[Entidad]ById(requestDto, req);
  }

  @Put(':id')
  @Auth(UserRole.ADMIN)
  @ApiUpdate[Entidad]()
  async update(
    @Body() requestDto: Update[Entidad]RequestDto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<[Entidad]DataDto>> {
    return this.[entidad]Service.update[Entidad](requestDto, req);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiDelete[Entidad]()
  async remove(
    @Param() requestDto: Delete[Entidad]RequestDto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<{ id: string }>> {
    return this.[entidad]Service.delete[Entidad](requestDto, req);
  }
}
```

## ESTÁNDAR SERVICIO UNIFICADO

### Reglas Obligatorias del Servicio:

1. **SIN implementación de interfaces**: Los servicios NO implementan interfaces de servicio
2. **Interfaces internas**: Usar interfaces (inline o importadas) para procesamiento interno
3. **Signature (dto, req)**: Todos los métodos públicos reciben `(dto, req)`
4. **req SIEMPRE requerido**: Nunca opcional, siempre como último parámetro
5. **Conversión DTO → Interface**: Convertir inmediatamente DTOs a interfaces
6. **Constantes de mensajes**: Usar `SUCCESS_MESSAGES` y `ERROR_MESSAGES`
7. **Nomenclatura**: `action + Entity` para métodos públicos

### Plantilla de Servicio:
```typescript
import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { I[Entidad]CrudRepository, I[Entidad]SearchRepository } from '../interfaces';
import { [Entidad] } from '../entities/[entidad].entity';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../common/constants';
import {
  Create[Entidad]RequestDto,
  GetAll[Entidades]Dto,
  Get[Entidad]ByIdDto,
  Update[Entidad]RequestDto,
  Delete[Entidad]RequestDto,
  Search[Entidades]RequestDto,
} from '../dto';

// ✅ INTERFACES INTERNAS (inline o importadas)
interface ICreate[Entidad]Data {
  // campos de la entidad
}

interface ICreate[Entidad]Request {
  [entidad]Data: ICreate[Entidad]Data;
}

interface I[Entidad]Profile {
  id: string;
  // campos de respuesta
  createdAt: Date;
  updatedAt: Date;
}

interface I[Entidad]Response {
  data: I[Entidad]Profile;
  message: string;
}

interface I[Entidades]ListResponse {
  data: I[Entidad]Profile[];
  meta?: any;
  message: string;
}

interface IDelete[Entidad]Response {
  data: { id: string };
  message: string;
}

@Injectable()
export class [Entidad]Service {
  constructor(
    @Inject('I[Entidad]CrudRepository')
    private readonly [entidad]CrudRepository: I[Entidad]CrudRepository,
    @Inject('I[Entidad]SearchRepository')
    private readonly [entidad]SearchRepository: I[Entidad]SearchRepository,
  ) {}

  // ✅ MÉTODOS PÚBLICOS - Siempre reciben (dto, req)
  async create[Entidad](
    requestDto: Create[Entidad]RequestDto,
    req: ExpressRequest, // ✅ SIEMPRE requerido
  ): Promise<I[Entidad]Response> {
    try {
      const currentUserId = (req as any).user?.userId;
      
      // ✅ OBLIGATORIO: Convertir DTO a interface
      const create[Entidad]Request: ICreate[Entidad]Request = {
        [entidad]Data: {
          // mapear campos del requestDto.[entidad]Data a interface
        }
      };

      // ✅ PROCESAR usando interface, NO DTO
      await this.validateUniqueConstraints(create[Entidad]Request.[entidad]Data);

      const [entidad] = await this.[entidad]CrudRepository.create[Entidad]({
        create[Entidad]Dto: create[Entidad]Request.[entidad]Data,
        performedBy: currentUserId,
      });

      return {
        data: this.build[Entidad]Profile([entidad]),
        message: SUCCESS_MESSAGES.[ENTIDADES].CREATE_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll[Entidades](
    requestDto: GetAll[Entidades]Dto,
    req: ExpressRequest,
  ): Promise<I[Entidades]ListResponse> {
    try {
      const currentUserId = (req as any).user?.userId;

      const result = await this.[entidad]CrudRepository.getAll[Entidades]({
        pagination: requestDto.pagination,
        performedBy: currentUserId,
      });

      return {
        data: result.data.map((item) => this.build[Entidad]Profile(item)),
        meta: result.meta,
        message: SUCCESS_MESSAGES.[ENTIDADES].FETCH_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async find[Entidad]ById(
    requestDto: Get[Entidad]ByIdDto,
    req: ExpressRequest,
  ): Promise<I[Entidad]Response> {
    try {
      const currentUserId = (req as any).user?.userId;

      const [entidad] = await this.[entidad]CrudRepository.get[Entidad]ById({
        id: requestDto.id,
        performedBy: currentUserId,
      });

      if (![entidad]) {
        throw new NotFoundException(ERROR_MESSAGES.[ENTIDADES].NOT_FOUND);
      }

      return {
        data: this.build[Entidad]Profile([entidad]),
        message: SUCCESS_MESSAGES.[ENTIDADES].FETCH_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async update[Entidad](
    requestDto: Update[Entidad]RequestDto,
    req: ExpressRequest,
  ): Promise<I[Entidad]Response> {
    try {
      const currentUserId = (req as any).user?.userId;
      
      await this.validate[Entidad]Exists(requestDto.id);

      const [entidad] = await this.[entidad]CrudRepository.update[Entidad]({
        id: requestDto.id,
        update[Entidad]Dto: requestDto.updateData,
        performedBy: currentUserId,
      });

      return {
        data: this.build[Entidad]Profile([entidad]),
        message: SUCCESS_MESSAGES.[ENTIDADES].UPDATE_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete[Entidad](
    requestDto: Delete[Entidad]RequestDto,
    req: ExpressRequest,
  ): Promise<IDelete[Entidad]Response> {
    try {
      const currentUserId = (req as any).user?.userId;
      
      await this.validate[Entidad]Exists(requestDto.id);

      await this.[entidad]CrudRepository.softDelete[Entidad]({
        id: requestDto.id,
        performedBy: currentUserId,
      });

      return {
        data: { id: requestDto.id },
        message: SUCCESS_MESSAGES.[ENTIDADES].DELETE_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  // ✅ MÉTODOS PRIVADOS - Helpers organizados por responsabilidad
  private build[Entidad]Profile([entidad]: [Entidad]): I[Entidad]Profile {
    return {
      id: [entidad].id,
      // mapear campos
      createdAt: [entidad].createdAt,
      updatedAt: [entidad].updatedAt,
    };
  }

  private async validateUniqueConstraints(data: ICreate[Entidad]Data): Promise<void> {
    // lógica de validación usando interface
  }

  private async validate[Entidad]Exists(id: string): Promise<void> {
    // lógica de validación
  }
}
```

## ESTÁNDAR DTO (Data Transfer Objects)

### Reglas Obligatorias de DTOs:

1. **Solo para validación**: Los DTOs SOLO se usan para validación en controladores
2. **Nunca en servicios**: Los servicios NUNCA procesan DTOs directamente
3. **Estructura anidada**: Request DTOs contienen `[entidad]Data` anidado
4. **Validaciones completas**: Usar decoradores de class-validator
5. **Documentación Swagger**: Todos los campos documentados con @ApiProperty

### Plantilla de DTOs:

#### Create Request DTO:
```typescript
// create-[entidad]-request.dto.ts
import { Type } from 'class-transformer';
import { ValidateNested, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Create[Entidad]DataDto {
  @ApiProperty({
    description: 'Campo obligatorio',
    example: 'ejemplo',
  })
  @IsString()
  campo: string;

  @ApiProperty({
    description: 'Campo opcional',
    example: 'ejemplo',
    required: false,
  })
  @IsOptional()
  @IsString()
  campoOpcional?: string;
}

export class Create[Entidad]RequestDto {
  @ApiProperty({
    description: 'Datos de la [entidad]',
    type: Create[Entidad]DataDto,
  })
  @ValidateNested()
  @Type(() => Create[Entidad]DataDto)
  [entidad]Data: Create[Entidad]DataDto;
}
```

#### Get All DTO:
```typescript
// get-all-[entidades].dto.ts
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class GetAll[Entidades]Dto {
  @ApiProperty({
    description: 'Parámetros de paginación',
    type: PaginationDto,
  })
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto;
}
```

#### Get By ID DTO:
```typescript
// get-[entidad]-by-id.dto.ts
import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Get[Entidad]ByIdDto {
  @ApiProperty({
    description: 'ID de la [entidad]',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsUUID()
  id: string;
}
```

#### Update Request DTO:
```typescript
// update-[entidad]-request.dto.ts
import { Type } from 'class-transformer';
import { ValidateNested, IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Update[Entidad]DataDto {
  @ApiProperty({
    description: 'Campo opcional para actualizar',
    example: 'nuevo valor',
    required: false,
  })
  @IsOptional()
  @IsString()
  campo?: string;
}

export class Update[Entidad]RequestDto {
  @ApiProperty({
    description: 'ID de la [entidad] a actualizar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Datos a actualizar',
    type: Update[Entidad]DataDto,
  })
  @ValidateNested()
  @Type(() => Update[Entidad]DataDto)
  updateData: Update[Entidad]DataDto;
}
```

#### Delete Request DTO:
```typescript
// delete-[entidad]-request.dto.ts
import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Delete[Entidad]RequestDto {
  @ApiProperty({
    description: 'ID de la [entidad] a eliminar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsUUID()
  id: string;
}
```

#### Data DTOs para respuestas:
```typescript
// [entidad]-data.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class [Entidad]DataDto {
  @ApiProperty({
    description: 'ID de la [entidad]',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Campo de la entidad',
    example: 'valor ejemplo',
  })
  campo: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de actualización',
    example: '2024-01-15T15:45:00.000Z',
  })
  updatedAt: Date;
}

// [entidades]-list-data.dto.ts
export class [Entidades]ListDataDto {
  @ApiProperty({
    description: 'Lista de [entidades]',
    type: [[Entidad]DataDto],
  })
  [entidades]: [Entidad]DataDto[];
}
```

#### DTO Index:
```typescript
// dto/index.ts
export * from './create-[entidad]-request.dto';
export * from './get-all-[entidades].dto';
export * from './get-[entidad]-by-id.dto';
export * from './update-[entidad]-request.dto';
export * from './delete-[entidad]-request.dto';
export * from './[entidad]-data.dto';
export * from './[entidades]-list-data.dto';
```

## ESTÁNDAR DECORADORES SWAGGER

### Reglas Obligatorias de Decoradores:

1. **Un decorador por endpoint**: Cada método del controlador tiene su decorador
2. **Respuestas específicas**: Usar DTOs específicos, NO genéricos
3. **Todos los escenarios**: Documentar success, error, unauthorized, etc.
4. **ApiBearerAuth**: Incluir para endpoints autenticados

### Plantilla de Decoradores:

```typescript
// api-create-[entidad].decorator.ts
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StandardResponseDto } from '../../../common/dto/paginated-response.dto';
import { [Entidad]DataDto } from '../dto/[entidad]-data.dto';

export function ApiCreate[Entidad]() {
  return applyDecorators(
    ApiOperation({
      summary: 'Crear [entidad]',
      description: 'Crear nueva [entidad] - Acceso: ADMIN',
    }),
    ApiResponse({
      status: 201,
      description: '[Entidad] creada exitosamente',
      type: StandardResponseDto<[Entidad]DataDto>,
    }),
    ApiResponse({
      status: 409,
      description: 'Conflicto - [Entidad] ya existe',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Datos de entrada inválidos',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Token JWT inválido o faltante',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Permisos insuficientes',
    }),
    ApiBearerAuth('JWT-auth'),
  );
}

// api-get-[entidades].decorator.ts
export function ApiGet[Entidades]() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener todas las [entidades]',
      description: 'Obtener lista paginada de [entidades] - Acceso: ADMIN, USER',
    }),
    ApiResponse({
      status: 200,
      description: '[Entidades] obtenidas exitosamente',
      type: StandardResponseDto<[Entidades]ListDataDto>,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Token JWT inválido o faltante',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Permisos insuficientes',
    }),
    ApiBearerAuth('JWT-auth'),
  );
}

// api-get-[entidad]-by-id.decorator.ts
export function ApiGet[Entidad]ById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener [entidad] por ID',
      description: 'Obtener [entidad] por ID - Acceso: ADMIN, USER',
    }),
    ApiResponse({
      status: 200,
      description: '[Entidad] obtenida exitosamente',
      type: StandardResponseDto<[Entidad]DataDto>,
    }),
    ApiResponse({
      status: 404,
      description: '[Entidad] no encontrada',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Token JWT inválido o faltante',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Permisos insuficientes',
    }),
    ApiBearerAuth('JWT-auth'),
  );
}

// api-update-[entidad].decorator.ts
export function ApiUpdate[Entidad]() {
  return applyDecorators(
    ApiOperation({
      summary: 'Actualizar [entidad]',
      description: 'Actualizar [entidad] por ID - Acceso: ADMIN',
    }),
    ApiResponse({
      status: 200,
      description: '[Entidad] actualizada exitosamente',
      type: StandardResponseDto<[Entidad]DataDto>,
    }),
    ApiResponse({
      status: 404,
      description: '[Entidad] no encontrada',
    }),
    ApiResponse({
      status: 409,
      description: 'Conflicto - Datos duplicados',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Datos de entrada inválidos',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Token JWT inválido o faltante',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Permisos insuficientes',
    }),
    ApiBearerAuth('JWT-auth'),
  );
}

// api-delete-[entidad].decorator.ts
export function ApiDelete[Entidad]() {
  return applyDecorators(
    ApiOperation({
      summary: 'Eliminar [entidad]',
      description: 'Eliminar [entidad] por ID (soft delete) - Acceso: ADMIN',
    }),
    ApiResponse({
      status: 200,
      description: '[Entidad] eliminada exitosamente',
      type: StandardResponseDto<{ id: string }>,
    }),
    ApiResponse({
      status: 404,
      description: '[Entidad] no encontrada',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Token JWT inválido o faltante',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Permisos insuficientes',
    }),
    ApiBearerAuth('JWT-auth'),
  );
}

// decorators/index.ts
export * from './api-create-[entidad].decorator';
export * from './api-get-[entidades].decorator';
export * from './api-get-[entidad]-by-id.decorator';
export * from './api-update-[entidad].decorator';
export * from './api-delete-[entidad].decorator';
```

## CONVENCIONES DE NOMENCLATURA

### Archivos:
- **Controladores**: `[nombre-modulo].controller.ts` (ej: `users.controller.ts`)
- **Servicios**: `[entidad].service.ts` (ej: `user.service.ts`) - SIEMPRE singular
- **Repositorios**: `[entidad]-crud.repository.ts`, `[entidad]-search.repository.ts`
- **DTOs**: `[accion]-[entidad]-request.dto.ts`, `[entidad]-data.dto.ts`
- **Decoradores**: `api-[accion]-[entidad].decorator.ts`
- **Entidades**: `[entidad].entity.ts`

### Clases:
- **Controladores**: `[Entidades]Controller` (ej: `UsersController`)
- **Servicios**: `[Entidad]Service` (ej: `UserService`)
- **DTOs**: `[Accion][Entidad]RequestDto` (ej: `CreateUserRequestDto`)
- **Entidades**: `[Entidad]` (ej: `User`)

### Métodos:
- **Controlador**: `create()`, `findAll()`, `findOne()`, `update()`, `remove()`
- **Servicio**: `create[Entidad]()`, `findAll[Entidades]()`, `find[Entidad]ById()`, `update[Entidad]()`, `delete[Entidad]()`
- **Privados**: `validate[Entidad]()`, `build[Entidad]Profile()`, `generate[Algo]()`, `extract[Dato]()`

## CASOS ESPECIALES

### Módulo Auth:
- Métodos específicos: `loginUser()`, `registerUser()`, `getUserProfile()`
- Mensajes diferenciados: `LOGIN_SUCCESS` vs `REGISTER_SUCCESS`
- Integración con UserService: `userService.findToLoginByEmail()`, `userService.register()`

### Acceso a Usuario JWT:
```typescript
const userId = (req as any).user?.userId;
const username = (req as any).user?.username;
const userRole = (req as any).user?.role;
```

### Respuesta StandardResponseDto:
```typescript
// Controlador tipado
Promise<StandardResponseDto<[Entidad]DataDto>>

// Servicio interface
Promise<I[Entidad]Response>

// Estructura interna interface
interface I[Entidad]Response {
  data: I[Entidad]Profile;
  message: string;
}
```

## ANTES DE COMPROMETER CAMBIOS

```bash
# Validación completa obligatoria
npm run build && npm run lint && npm run test:cov

# Con Docker (si contenedores están corriendo)
npm run docker:exec:build && npm run docker:exec:lint && npm run docker:exec:test:cov
```

## DOCUMENTACIÓN API

- **Swagger**: `http://localhost:3000/apidoc`
- **Base de datos**: PostgreSQL con TypeORM
- **Autenticación**: JWT con roles (ADMIN, USER)
- **Interceptores**: Response formatting, audit logging

---

**IMPORTANTE**: Esta documentación debe seguirse EXACTAMENTE para mantener consistencia arquitectural en todo el proyecto.