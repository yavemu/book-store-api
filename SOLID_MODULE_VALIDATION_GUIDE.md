# Guía de Validación de Módulos SOLID

## 📋 Índice
1. [Introducción](#introducción)
2. [Principios SOLID](#principios-solid)
3. [Checklist de Validación](#checklist-de-validación)
4. [Proceso Paso a Paso](#proceso-paso-a-paso)
5. [Ejemplos Prácticos](#ejemplos-prácticos)
6. [Métricas de Calidad](#métricas-de-calidad)
7. [Herramientas de Diagnóstico](#herramientas-de-diagnóstico)

---

## 🎯 Introducción

Esta guía proporciona un proceso sistemático para validar que los módulos de NestJS cumplan con los principios SOLID y mantengan una arquitectura modular y escalable.

### Objetivos
- ✅ Garantizar código mantenible y testeable
- ✅ Promover arquitectura limpia y escalable
- ✅ Establecer estándares de calidad consistentes
- ✅ Facilitar el desarrollo colaborativo

---

## 🏗️ Principios SOLID

### **S - Single Responsibility Principle (SRP)**
> Una clase debe tener una sola razón para cambiar

**Qué validar:**
- Cada clase tiene una responsabilidad única y bien definida
- Los métodos están relacionados con la responsabilidad de la clase
- No hay mezcla de responsabilidades (lógica de negocio + manejo de errores + validaciones)

### **O - Open/Closed Principle (OCP)**
> Las entidades de software deben estar abiertas para extensión pero cerradas para modificación

**Qué validar:**
- Se puede extender funcionalidad sin modificar código existente
- Uso adecuado de interfaces y herencia
- Patrones como Strategy, Decorator, Factory

### **L - Liskov Substitution Principle (LSP)**
> Los objetos de una superclase deben poder ser reemplazados por objetos de sus subclases

**Qué validar:**
- Las subclases mantienen el contrato de la clase base
- No se lanzan excepciones inesperadas en overrides
- El comportamiento es consistente con las expectativas

### **I - Interface Segregation Principle (ISP)**
> Los clientes no deben depender de interfaces que no usan

**Qué validar:**
- Interfaces pequeñas y específicas
- Sin métodos innecesarios en las interfaces
- Separación por responsabilidades

### **D - Dependency Inversion Principle (DIP)**
> Los módulos de alto nivel no deben depender de módulos de bajo nivel. Ambos deben depender de abstracciones

**Qué validar:**
- Uso de inyección de dependencias
- Dependencias en abstracciones, no en concreciones
- Inversión del control adecuada

---

## ✅ Checklist de Validación

### 📁 **Estructura de Archivos**

```
src/modules/[module-name]/
├── controllers/
│   └── [module].controller.ts
├── services/
│   ├── [module].service.ts
│   ├── validation.service.ts
│   ├── error-handler.service.ts
│   └── user-context.service.ts
├── repositories/
│   └── [module].repository.ts
├── interfaces/
│   ├── [module]-crud.repository.interface.ts
│   ├── [module]-search.repository.interface.ts
│   ├── [module]-validation.repository.interface.ts
│   ├── [module]-crud.service.interface.ts
│   ├── [module]-search.service.interface.ts
│   ├── validation.service.interface.ts
│   ├── error-handler.service.interface.ts
│   ├── user-context.service.interface.ts
│   └── index.ts
├── dto/
│   ├── create-[entity].dto.ts
│   ├── update-[entity].dto.ts
│   └── [entity]-response.dto.ts
├── entities/
│   └── [entity].entity.ts
├── decorators/
│   └── api decorators
├── _test_/
│   └── test files
└── [module].module.ts
```

### 🔍 **Validación por Archivo**

#### **Controller**
- [ ] **SRP**: Solo manejo de HTTP requests/responses
- [ ] **DIP**: Depende de interfaces de servicios, no implementaciones
- [ ] **ISP**: Usa interfaces específicas (CRUD, Search separadas)
- [ ] **Validación**: Uso de `UserContextService` para extraer contexto
- [ ] **Documentación**: Decoradores API completos
- [ ] **Autorización**: Decoradores `@Auth()` correctos
- [ ] **DTOs**: Validación y transformación de datos

#### **Services**
- [ ] **SRP**: Responsabilidad única por servicio
- [ ] **DIP**: Dependencias inyectadas como interfaces
- [ ] **ISP**: Implementa interfaces específicas, no genéricas
- [ ] **Error Handling**: Uso de `ErrorHandlerService`
- [ ] **Validation**: Delegación a `ValidationService`
- [ ] **Business Logic**: Sin lógica de acceso a datos directa
- [ ] **Constants**: Uso de `ERROR_MESSAGES` constantes

#### **Repository**
- [ ] **LSP**: Extiende `BaseRepository` correctamente
- [ ] **SRP**: Solo acceso a datos, sin validaciones ni errores
- [ ] **ISP**: Implementa interfaces segregadas
- [ ] **BaseRepository**: Solo llama métodos de la clase base
- [ ] **TypeORM**: Configuración correcta de entidades
- [ ] **Audit**: Integración con sistema de auditoría

#### **Interfaces**
- [ ] **ISP**: Interfaces pequeñas y específicas
- [ ] **Segregation**: Separadas por responsabilidad
  - `ICrudRepository` - CRUD operations
  - `ISearchRepository` - Search operations
  - `IValidationRepository` - Validation queries
  - `ICrudService` - Business logic
  - `ISearchService` - Search business logic
- [ ] **Naming**: Convención clara y consistente
- [ ] **Exports**: Archivo `index.ts` actualizado

#### **Module Configuration**
- [ ] **DI**: Inyección de dependencias correcta
- [ ] **Providers**: Uso de `useExisting` para evitar múltiples instancias
- [ ] **Exports**: Solo clases principales, no aliases
- [ ] **Imports**: Módulos necesarios importados
- [ ] **TypeORM**: Configuración de entidades

### 🎨 **Patrones de Diseño**

#### **Repository Pattern**
- [ ] Abstracción de acceso a datos
- [ ] Métodos específicos del dominio
- [ ] Sin lógica de negocio

#### **Service Layer Pattern**
- [ ] Lógica de negocio centralizada
- [ ] Orquestación de operaciones
- [ ] Manejo de transacciones

#### **Dependency Injection Pattern**
- [ ] Inversión de dependencias
- [ ] Testabilidad mejorada
- [ ] Bajo acoplamiento

---

## 📝 Proceso Paso a Paso

### **Fase 1: Análisis Inicial**

#### **1.1 Revisar estructura de archivos**
```bash
# Verificar que existe la estructura estándar
ls -la src/modules/[module-name]/
```

#### **1.2 Validar imports**
```typescript
// ❌ MAL - Dependencias circulares
import { ServiceA } from '../service-a/service-a';
import { ServiceB } from '../service-b/service-b';

// ✅ BIEN - Dependencias en interfaces
import { IServiceA } from './interfaces/service-a.interface';
```

#### **1.3 Contar responsabilidades**
```typescript
// ❌ MAL - Múltiples responsabilidades
class UserService {
  create() {} // CRUD
  validateEmail() {} // Validation  
  sendEmail() {} // Notification
  generateReport() {} // Reporting
}

// ✅ BIEN - Responsabilidad única
class UserCrudService {
  create() {}
  update() {}
  delete() {}
}
```

### **Fase 2: Validación SOLID**

#### **2.1 Single Responsibility Principle**

**Checklist por clase:**
- [ ] Una sola razón para cambiar
- [ ] Métodos cohesivos
- [ ] Nombre descriptivo de la responsabilidad

**Comandos de validación:**
```bash
# Contar métodos por clase (máximo recomendado: 10)
grep -n "async\|function" src/modules/[module]/services/*.ts

# Buscar responsabilidades mixtas
grep -n "validate\|send\|log\|transform" src/modules/[module]/services/*.ts
```

#### **2.2 Open/Closed Principle**

**Validaciones:**
- [ ] Uso de interfaces para extensión
- [ ] Polimorfismo implementado
- [ ] Sin modificación de código existente para nuevas funciones

```typescript
// ✅ BIEN - Extensible sin modificar
interface IPaymentProcessor {
  process(amount: number): Promise<void>;
}

class CreditCardProcessor implements IPaymentProcessor {
  process(amount: number): Promise<void> {
    // Implementation
  }
}

// Nueva funcionalidad sin modificar existente
class PayPalProcessor implements IPaymentProcessor {
  process(amount: number): Promise<void> {
    // Implementation
  }
}
```

#### **2.3 Liskov Substitution Principle**

**Validaciones:**
- [ ] Subclases mantienen contrato
- [ ] Sin debilitamiento de precondiciones
- [ ] Sin fortalecimiento de postcondiciones

```typescript
// ❌ MAL - Viola LSP
class Rectangle {
  setWidth(width: number) { this.width = width; }
  setHeight(height: number) { this.height = height; }
}

class Square extends Rectangle {
  setWidth(width: number) { 
    this.width = width;
    this.height = width; // Cambia comportamiento
  }
}

// ✅ BIEN - Respeta LSP
abstract class Shape {
  abstract area(): number;
}

class RectangleShape extends Shape {
  area(): number { return this.width * this.height; }
}
```

#### **2.4 Interface Segregation Principle**

**Validaciones:**
- [ ] Interfaces pequeñas (máximo 5 métodos)
- [ ] Separación por responsabilidades
- [ ] Clientes no dependen de métodos innecesarios

```typescript
// ❌ MAL - Interface grande
interface IUserRepository {
  create(): Promise<User>;
  findAll(): Promise<User[]>;
  search(): Promise<User[]>;
  validate(): Promise<boolean>;
  sendEmail(): Promise<void>;
  generateReport(): Promise<Report>;
}

// ✅ BIEN - Interfaces segregadas
interface IUserCrudRepository {
  create(): Promise<User>;
  findAll(): Promise<User[]>;
}

interface IUserSearchRepository {
  search(): Promise<User[]>;
}

interface IUserValidationRepository {
  validate(): Promise<boolean>;
}
```

#### **2.5 Dependency Inversion Principle**

**Validaciones:**
- [ ] Dependencias inyectadas
- [ ] Uso de interfaces, no clases concretas
- [ ] Módulos de alto nivel no dependen de bajo nivel

```typescript
// ❌ MAL - Dependencia directa
class UserService {
  private userRepository = new UserRepository(); // Dependencia concreta
}

// ✅ BIEN - Inversión de dependencias
class UserService {
  constructor(
    @Inject('IUserRepository')
    private userRepository: IUserRepository // Dependencia abstracta
  ) {}
}
```

### **Fase 3: Validación de Patrones**

#### **3.1 Error Handling Pattern**
```typescript
// ✅ Patrón correcto
class BookAuthorService {
  constructor(
    @Inject('IErrorHandlerService')
    private errorHandler: IErrorHandlerService
  ) {}

  async create(dto: CreateDto): Promise<Entity> {
    try {
      return await this.repository.create(dto);
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.FAILED_TO_CREATE);
    }
  }
}
```

#### **3.2 Validation Pattern**
```typescript
// ✅ Patrón correcto
class BookAuthorService {
  async create(dto: CreateDto): Promise<Entity> {
    await this.validationService.validateUniqueConstraints(
      dto, 
      undefined, 
      constraints,
      this.repository
    );
  }
}
```

#### **3.3 User Context Pattern**
```typescript
// ✅ Patrón correcto
class BookAuthorsController {
  create(@Body() dto: CreateDto, @Request() req: any) {
    const userId = this.userContextService.extractUserId(req);
    return this.service.create(dto, userId);
  }
}
```

### **Fase 4: Validación Técnica**

#### **4.1 Compilación**
```bash
npm run build
```

#### **4.2 Linting**
```bash
npm run lint
```

#### **4.3 Tests**
```bash
npm run test:unit
npm run test:e2e
```

#### **4.4 Coverage**
```bash
npm run test:cov
# Mínimo 80% coverage
```

---

## 🧪 Ejemplos Prácticos

### **Ejemplo 1: Módulo Compliant**

```typescript
// ✅ EXCELENTE - Cumple todos los principios
@Injectable()
export class BookAuthorService implements IBookAuthorCrudService {
  constructor(
    @Inject('IBookAuthorCrudRepository')
    private crudRepository: IBookAuthorCrudRepository,
    @Inject('IValidationService') 
    private validationService: IValidationService,
    @Inject('IErrorHandlerService')
    private errorHandler: IErrorHandlerService,
  ) {}

  async create(dto: CreateBookAuthorDto, performedBy: string): Promise<BookAuthor> {
    try {
      await this.validationService.validateUniqueConstraints(dto, undefined, constraints, this.crudRepository);
      return await this.crudRepository.create(dto, performedBy);
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.FAILED_TO_CREATE);
    }
  }
}
```

### **Ejemplo 2: Módulo con Violaciones**

```typescript
// ❌ MALO - Múltiples violaciones SOLID
@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository, // DIP violation - concrete dependency
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    // SRP violation - validation logic in service
    if (!dto.email.includes('@')) {
      throw new BadRequestException('Invalid email');
    }
    
    // SRP violation - direct error handling
    try {
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException('User already exists');
      }
      
      const user = await this.userRepository.create(dto);
      
      // SRP violation - sending emails in service
      await this.sendWelcomeEmail(user.email);
      
      return user;
    } catch (error) {
      // Generic error handling
      throw new HttpException('Failed to create user', 500);
    }
  }

  // SRP violation - email functionality in user service
  private async sendWelcomeEmail(email: string): Promise<void> {
    // Email sending logic
  }
  
  // ISP violation - mixing CRUD with search
  async searchUsers(term: string): Promise<User[]> {
    return this.userRepository.search(term);
  }
}
```

---

## 📊 Métricas de Calidad

### **Métricas por Clase**

| Métrica | Valor Objetivo | Descripción |
|---------|---------------|-------------|
| **Métodos por clase** | ≤ 10 | Indicador de SRP |
| **Líneas por método** | ≤ 20 | Complejidad del método |
| **Dependencias por clase** | ≤ 5 | Nivel de acoplamiento |
| **Interfaces implementadas** | ≤ 3 | Cumplimiento ISP |
| **Profundidad herencia** | ≤ 3 | Complejidad herencia |

### **Métricas por Módulo**

| Métrica | Valor Objetivo | Descripción |
|---------|---------------|-------------|
| **Cobertura de tests** | ≥ 80% | Calidad del testing |
| **Complejidad ciclomática** | ≤ 10 | Complejidad del código |
| **Interfaces vs Clases** | 2:1 | Nivel de abstracción |
| **Archivos por carpeta** | ≤ 10 | Organización |

### **Comandos para Métricas**

```bash
# Contar métodos por clase
find src/modules -name "*.ts" -exec grep -l "class\|interface" {} \; | xargs grep -n "async\|function" | wc -l

# Líneas por archivo
find src/modules -name "*.ts" -exec wc -l {} \; | sort -n

# Dependencias por clase
grep -r "@Inject" src/modules | wc -l

# Interfaces vs implementaciones
find src/modules -name "*.interface.ts" | wc -l
find src/modules -name "*.service.ts" -o -name "*.repository.ts" | wc -l
```

---

## 🛠️ Herramientas de Diagnóstico

### **Scripts de Validación Automática**

#### **1. Script de Estructura**
```bash
#!/bin/bash
# validate-structure.sh

MODULE_NAME=$1
MODULE_PATH="src/modules/$MODULE_NAME"

echo "🔍 Validating module structure: $MODULE_NAME"

# Check required directories
directories=("controllers" "services" "repositories" "interfaces" "dto" "entities")
for dir in "${directories[@]}"; do
    if [ -d "$MODULE_PATH/$dir" ]; then
        echo "✅ $dir directory exists"
    else
        echo "❌ $dir directory missing"
    fi
done

# Check required files
echo "📁 Checking core files..."
[ -f "$MODULE_PATH/$MODULE_NAME.module.ts" ] && echo "✅ Module file exists" || echo "❌ Module file missing"
[ -f "$MODULE_PATH/interfaces/index.ts" ] && echo "✅ Interface index exists" || echo "❌ Interface index missing"
```

#### **2. Script de SOLID Validation**
```bash
#!/bin/bash
# validate-solid.sh

MODULE_PATH="src/modules/$1"

echo "🏗️ SOLID Principles Validation"

# SRP - Count responsibilities per class
echo "📊 SRP Analysis:"
for file in $MODULE_PATH/**/*.ts; do
    methods=$(grep -c "async\|function" "$file" 2>/dev/null || echo 0)
    if [ $methods -gt 10 ]; then
        echo "⚠️  $file has $methods methods (>10 - possible SRP violation)"
    fi
done

# DIP - Check for concrete dependencies  
echo "🔗 DIP Analysis:"
concrete_deps=$(grep -r "new.*Repository\|new.*Service" $MODULE_PATH --include="*.ts" | wc -l)
if [ $concrete_deps -gt 0 ]; then
    echo "⚠️  Found $concrete_deps concrete dependencies"
    grep -r "new.*Repository\|new.*Service" $MODULE_PATH --include="*.ts"
fi

# ISP - Check interface sizes
echo "🔄 ISP Analysis:"
for interface in $MODULE_PATH/interfaces/*.interface.ts; do
    methods=$(grep -c ":" "$interface" 2>/dev/null || echo 0)
    if [ $methods -gt 5 ]; then
        echo "⚠️  $(basename $interface) has $methods methods (>5 - possible ISP violation)"
    fi
done
```

#### **3. Script de Coverage Check**
```bash
#!/bin/bash
# check-coverage.sh

echo "🧪 Running test coverage analysis..."

npm run test:cov

# Parse coverage results
COVERAGE=$(npm run test:cov 2>&1 | grep -o "All files.*[0-9]*\.[0-9]*" | grep -o "[0-9]*\.[0-9]*" | head -1)

if (( $(echo "$COVERAGE >= 80" | bc -l) )); then
    echo "✅ Coverage $COVERAGE% meets requirement (≥80%)"
else
    echo "❌ Coverage $COVERAGE% below requirement (≥80%)"
    exit 1
fi
```

### **VSCode Extensions Recomendadas**

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-jest"
  ]
}
```

### **ESLint Rules para SOLID**

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "max-lines-per-function": ["error", 20],
    "max-params": ["error", 4],
    "complexity": ["error", 10],
    "class-methods-use-this": "error",
    "@typescript-eslint/explicit-function-return-type": "error"
  }
}
```

---

## 📈 Plan de Mejora Continua

### **Proceso de Review**

1. **Pre-commit Hooks**
   - Lint check
   - Test execution
   - Coverage validation

2. **PR Review Checklist**
   - SOLID compliance check
   - Interface segregation review
   - Dependency injection validation

3. **Periodic Architecture Review**
   - Mensual: Review de métricas
   - Trimestral: Refactoring de módulos
   - Semestral: Actualización de patrones

### **Training Plan**

1. **Nivel Básico**
   - Principios SOLID
   - Dependency Injection
   - Interface Segregation

2. **Nivel Intermedio**
   - Design Patterns
   - Clean Architecture
   - Testing Strategies

3. **Nivel Avanzado**
   - Domain Driven Design
   - CQRS Pattern
   - Event Sourcing

---

## ✅ Resultado Final

### **Score de Calidad**

- **9.0-10.0**: Excelente - Cumple todos los principios
- **7.0-8.9**: Bueno - Minor violations 
- **5.0-6.9**: Regular - Needs improvement
- **< 5.0**: Pobre - Major refactoring required

### **Certificación del Módulo**

Un módulo se considera **SOLID-compliant** cuando:

- ✅ Pasa todas las validaciones del checklist
- ✅ Tiene cobertura de tests ≥ 80%
- ✅ Compila sin errores ni warnings
- ✅ Cumple métricas de calidad
- ✅ Sigue convenciones de nomenclatura
- ✅ Tiene documentación API completa

---

**📝 Nota**: Este documento debe actualizarse conforme evolucionen los estándares del proyecto y se identifiquen nuevos patrones o anti-patrones.