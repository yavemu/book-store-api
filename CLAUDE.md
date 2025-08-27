# Configuración de Claude - API Book Store

## 🎯 Referencia Principal

**SIEMPRE** consulta: `@.claude/MASTER_PROMPT_BACKEND.md` como la única fuente de verdad.

## 🔍 Navegación Rápida por Índice

Usa estos anclajes para saltar a secciones específicas en MASTER_PROMPT_BACKEND.md:

<!-- ARCHITECTURE_OVERVIEW --> → **Arquitectura General**
<!-- PROJECT_STRUCTURE --> → **Estructura del Proyecto**
<!-- AUTH_MODULE --> → **Módulo de Autenticación**
<!-- USERS_MODULE --> → **Módulo de Usuarios**
<!-- ROLES_MODULE --> → **Módulo de Roles**
<!-- AUDIT_MODULE --> → **Módulo de Auditoría**
<!-- COMMON_MODULE --> → **Módulo Común**
<!-- ENTITY_PATTERNS --> → **Patrones de Entidades**
<!-- REPOSITORY_PATTERNS --> → **Patrones de Repositorios**
<!-- BASE_REPOSITORY --> → **Repositorio Base**
<!-- CRUD_OPERATIONS --> → **Operaciones CRUD**
<!-- VALIDATION_PATTERNS --> → **Patrones de Validación**
<!-- SERVICE_PATTERNS --> → **Patrones de Servicios**
<!-- UTILITY_PATTERNS --> → **Utilidades Comunes**
<!-- API_PATTERNS → **Patrones de API**
<!-- TESTING_PATTERNS --> → **Patrones de Testing**
<!-- PAGINATION_PATTERNS --> → **Paginación**
<!-- SECURITY_PATTERNS --> → **Seguridad**
<!-- FAKER_MOCKS --> → **Mocks con Faker**

## ⚡ Ejemplos de Uso

**Cuando te pregunten sobre:**

- Autenticación → Salta a `<!-- AUTH_MODULE -->`
- Gestión de usuarios → Salta a `<!-- USERS_MODULE -->`
- Testing → Salta a `<!-- TESTING_PATTERNS -->`
- Repositorios → Salta a `<!-- REPOSITORY_PATTERNS -->`
- Entidades → Salta a `<!-- ENTITY_PATTERNS -->`
- Seguridad → Salta a `<!-- SECURITY_PATTERNS -->`
- Paginación → Salta a `<!-- PAGINATION_PATTERNS -->`

## 🚨 Requisitos Críticos

### DTOs y Decoradores

- Todos los DTOs deben incluir `@ApiProperty` o `@ApiPropertyOptional` de `@nestjs/swagger` para que la documentación sea clara en Swagger.
- Los enums deben mantenerse en la misma estructura de carpetas que DTOs, decorators e interfaces.
- Si faltan enums o interfaces, deben organizarse en carpetas correspondientes dentro de cada módulo.

### Protocolo de Verificación:

1. `npm run build` → Debe pasar sin errores
2. `npm run test` → Cobertura mínima del 80% requerida
3. `npm run lint` → Cero errores permitidos

### Manejo de Errores:

- **NUNCA** dejes el proyecto en estado roto
- Corrige errores de compilación inmediatamente
- Sigue los patrones establecidos del archivo maestro

## 📋 Estándares de Calidad

- ✅ **TypeScript en modo estricto**
- ✅ **Extensión de BaseRepository obligatoria**
- ✅ **Faker.js para todos los mocks**
- ✅ **Decoradores @Auth() apropiados**
- ✅ **Cumplimiento de patrones de entidades**
- ✅ **Validaciones con class-validator**
- ✅ **Paginación en todas las consultas GET**
- ✅ **Soft delete implementado**
- ✅ **Auditoría automática**

## ⚠️ Restricciones Importantes

**NO PROCEDAS** si algún paso de verificación falla. Corrige los problemas inmediatamente.

**NO USES `any`** como tipo a menos que sea absolutamente necesario.

**EXTIENDE BaseRepository** en todos los repositorios específicos.

**USA los mocks centralizados** de `src/common/mocks/` para testing.

## 🎯 Prioridades de Implementación

1. **Compilación exitosa** → TypeScript sin errores
2. **Tests pasando** → Cobertura mínima 80%
3. **Patrones seguidos** → Arquitectura consistente
4. **Seguridad implementada** → JWT + Roles
5. **Auditoría activa** → Logging de operaciones
