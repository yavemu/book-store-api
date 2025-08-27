# Book Store - Guía Completa de Instalación

Esta guía te llevará paso a paso por todo el proceso de configuración de la aplicación completa Book Store (API, Base de Datos e Interfaz Web) desde cero.

## Prerequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:

### Software Requerido

1. **Git** (versión 2.25+)

   - Descarga: https://git-scm.com/downloads
   - Verificar instalación: `git --version`

2. **Docker** (versión 20.10+)

   - Descarga: https://www.docker.com/products/docker-desktop
   - Verificar instalación: `docker --version`

3. **Docker Compose** (versión 2.0+)

   - Generalmente incluido con Docker Desktop
   - Verificar instalación: `docker-compose --version`

4. **Node.js** (versión 18.0+) - _Opcional, solo necesario para ejecución individual_
   - Descarga: https://nodejs.org/en/download/
   - Verificar instalación: `node --version` y `npm --version`

### Requisitos del Sistema

- **Sistema Operativo**: Windows 10+, macOS 10.14+, o Linux
- **RAM**: Mínimo 4GB, recomendado 8GB+
- **Almacenamiento**: Al menos 2GB de espacio libre

## Configuración de la Estructura del Proyecto

### Paso 1: Crear Directorio Raíz

Primero, crea el directorio principal del proyecto donde vivirán tanto la aplicación API como Web:

```bash
# Navega a la ubicación deseada (ej. Escritorio, Documentos, etc.)
cd ~/Documents  # o donde quieras crear el proyecto

# Crea la carpeta principal del proyecto
mkdir book-store
cd book-store
```

Tu estructura de directorios debería verse así:

```
book-store/           # ← Estás aquí
├── (vacío por ahora)
```

### Paso 2: Clonar Repositorios

Clona tanto el repositorio de la API como el Web dentro del directorio book-store:

```bash
# Asegúrate de estar en el directorio book-store
pwd  # Debería mostrar: /ruta/hacia/tu/book-store

# Clona el repositorio de la API
git clone https://github.com/yavemu/book-store-api.git

# Clona el repositorio Web
git clone https://github.com/yavemu/book-store-web.git
```

Después de clonar, tu estructura debería ser:

```
book-store/
├── book-store-api/
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   └── ...
└── book-store-web/
    ├── src/
    ├── package.json
    ├── Dockerfile
    └── ...
```

### Paso 3: Crear archivo .env para la API y Web

Copiar el archivo .env.example y renombrarlo a .env para la API y Web:

```bash
# Copia el archivo .env.example a la carpeta book-store-api
cp book-store-api/.env.example book-store-api/.env

# Copia el archivo .env.example a la carpeta book-store-web
cp book-store-web/.env.example book-store-web/.env
```

Luego, edita el archivo .env para configurar las variables de entorno con tu propia configuración

## Ejecución de la Aplicación con Docker Compose

### 📝 Scripts npm Disponibles para Docker

| Script | Descripción | Equivalente Docker Compose |
|--------|-------------|----------------------------|
| `npm run docker:build` | Construir imagen | `docker-compose build` |
| `npm run docker:up` | Ejecutar contenedores | `docker-compose up -d` |
| `npm run docker:up:build` | Construir y ejecutar | `docker-compose up --build -d` |
| `npm run docker:down` | Detener contenedores | `docker-compose down` |
| `npm run docker:down:clean` | Detener y limpiar datos | `docker-compose down -v` |
| `npm run docker:ps` | Ver estado | `docker-compose ps` |
| `npm run docker:logs` | Ver todos los logs | `docker-compose logs -f` |
| `npm run docker:logs:api` | Ver logs de API | `docker logs bookstore-api -f` |
| `npm run docker:logs:db` | Ver logs de DB | `docker logs bookstore-postgres -f` |
| `npm run docker:restart` | Reiniciar servicios | `docker-compose restart` |
| `npm run docker:shell:api` | Shell de API | `docker exec -it bookstore-api /bin/sh` |
| `npm run docker:shell:db` | Shell de PostgreSQL | `docker exec -it bookstore-postgres psql -U user -d bookstore_db` |
| `npm run docker:clean` | Limpiar sistema | `docker-compose down && docker system prune -f` |

### 🚀 Comandos Principales

#### **Usando Scripts npm (Recomendado)**
```bash
# Navegar al directorio de la API
cd book-store/book-store-api

# Construir y ejecutar contenedores
npm run docker:up:build

# Solo ejecutar (si ya están construidos)
npm run docker:up

# Ver estado de contenedores
npm run docker:ps

# URLs disponibles:
# 🌐 API: http://localhost:3000
# 📚 Documentación Swagger: http://localhost:3000/apidoc
# 🗄️ Base de datos: localhost:5433 (puerto externo)
```

#### **Usando Docker Compose Directamente**
```bash
# Navegar al directorio de la API
cd book-store/book-store-api

# Construir y ejecutar contenedores en modo detached
docker-compose up --build -d

# Ver estado de los contenedores
docker-compose ps
```

#### **Monitorear la Aplicación**
```bash
# Usando scripts npm (recomendado)
npm run docker:ps              # Ver estado de contenedores
npm run docker:logs            # Ver logs de todos los servicios
npm run docker:logs:api        # Ver logs solo de la API
npm run docker:logs:db         # Ver logs solo de la base de datos

# Usando Docker Compose directamente
docker-compose ps              # Ver estado de los contenedores
docker logs bookstore-api -f   # Ver logs en tiempo real (API)
docker logs bookstore-postgres -f # Ver logs en tiempo real (Base de datos)
docker-compose logs -f         # Ver logs de todos los servicios
```

#### **Detener la Aplicación**
```bash
# Usando scripts npm (recomendado)
npm run docker:down            # Detener contenedores (mantiene datos)
npm run docker:down:clean      # Detener y limpiar volúmenes (ELIMINA DATOS)
npm run docker:clean           # Detener y limpiar sistema Docker

# Usando Docker Compose directamente
docker-compose down            # Detener contenedores (mantiene datos)
docker-compose down -v         # Detener y limpiar volúmenes (ELIMINA DATOS)
docker-compose down --rmi all -v # Detener, limpiar y remover imágenes
```

### 🔧 Comandos de Desarrollo

#### **Reconstruir y Reiniciar**
```bash
# Usando scripts npm (recomendado)
npm run docker:build           # Reconstruir imagen
npm run docker:up:build        # Reconstruir y ejecutar
npm run docker:restart         # Reiniciar todos los servicios

# Usando Docker Compose directamente
docker-compose build --no-cache # Reconstruir imagen sin cache
docker-compose up --build -d   # Reconstruir y ejecutar
docker-compose restart api     # Reiniciar solo la API
docker-compose restart postgres # Reiniciar solo PostgreSQL
```

#### **Acceso a Contenedores**
```bash
# Usando scripts npm (recomendado)
npm run docker:shell:api       # Acceder al shell del contenedor API
npm run docker:shell:db        # Acceder al shell de PostgreSQL

# Usando Docker directamente
docker exec -it bookstore-api /bin/sh # Acceder al shell del contenedor API
docker exec -it bookstore-postgres psql -U user -d bookstore_db # Acceder a PostgreSQL

# Ejecutar comandos npm dentro del contenedor API
docker exec -it bookstore-api npm run test
docker exec -it bookstore-api npm run build
docker exec -it bookstore-api npm run seed
```

### 📋 Comandos de Base de Datos

#### **Gestión de Base de Datos**
```bash
# Acceder a la base de datos desde el contenedor
docker exec -it bookstore-postgres psql -U postgres

# Conectarse a la base de datos de la aplicación
docker exec -it bookstore-postgres psql -U user -d bookstore_db

# Hacer backup de la base de datos
docker exec bookstore-postgres pg_dump -U user bookstore_db > backup.sql

# Restaurar base de datos desde backup
docker exec -i bookstore-postgres psql -U user -d bookstore_db < backup.sql
```

### 🔍 Comandos de Troubleshooting

#### **Diagnóstico y Resolución de Problemas**
```bash
# Ver todos los contenedores (incluyendo detenidos)
docker ps -a

# Inspeccionar red de Docker
docker network ls
docker network inspect book-store-api_bookstore-network

# Ver uso de recursos
docker stats

# Limpiar sistema Docker (CUIDADO: afecta todo Docker)
docker system prune -f

# Limpiar solo contenedores detenidos
docker container prune -f

# Ver logs específicos con filtros
docker logs bookstore-api --since=1h
docker logs bookstore-api --tail=100
```

#### **Solución de Problemas Específicos**
```bash
# Si hay problemas con la red Docker
docker-compose down
docker network prune -f
docker-compose up --build -d

# Si hay conflictos de puerto
docker-compose down
sudo lsof -i :3000  # Ver qué usa el puerto
docker-compose up -d

# Si la base de datos no inicia
docker-compose down -v  # ELIMINA DATOS
docker volume prune -f
docker-compose up --build -d
```

### 📊 Comandos de Información

#### **Ver Información del Sistema**
```bash
# Ver información de volúmenes
docker volume ls
docker volume inspect book-store-api_postgres_data

# Ver información de imágenes
docker images

# Ver uso de espacio
docker system df

# Información detallada de contenedor
docker inspect bookstore-api
docker inspect bookstore-postgres
```

## Solución de Problemas

### Problemas Comunes

1. **Puerto Ya en Uso**

   ```bash
   Error: Port 3000 is already in use
   ```

   **Solución**: Detén cualquier servicio en ejecución o cambia los puertos en los archivos docker-compose.

2. **Docker No Está Ejecutándose**

   ```bash
   Error: Cannot connect to the Docker daemon
   ```

   **Solución**: Asegúrate de que Docker Desktop esté ejecutándose.

3. **Permisos Denegados**

   ```bash
   Error: Permission denied
   ```

   **Solución**: En Linux/Mac, intenta ejecutar con `sudo` o arregla los permisos de Docker.

4. **Problemas de Conexión a Base de Datos**
   ```bash
   Error: Connection to database failed
   ```
   **Solución**: Espera unos segundos para que la base de datos inicie completamente, luego reinicia el contenedor de la API.

### Comandos Útiles

```bash
# Ver todos los contenedores en ejecución
docker ps

# Ver todos los contenedores (incluyendo detenidos)
docker ps -a

# Remover todos los contenedores detenidos
docker system prune

# Acceder al shell del contenedor
docker exec -it bookstore-api /bin/sh
docker exec -it bookstore-web /bin/sh

# Ver logs del contenedor
docker logs bookstore-api
docker logs bookstore-web
docker logs bookstore-postgres
```

## Flujo de Desarrollo

### Hacer Cambios al Código

1. **Con Docker Compose Ejecutándose**: Los cambios al código se reflejan automáticamente debido al montaje de volúmenes.

2. **Reconstruir Después de Cambios Mayores**:
   ```bash
   docker-compose -f docker-compose-book-store-api.yml build
   docker-compose -f docker-compose-book-store-web.yml up --build
   ```

### Acceso a Base de Datos

Conectarse a la base de datos PostgreSQL:

```bash
# Usando psql (si está instalado localmente)
psql -h localhost -p 5433 -U user -d bookstore_db

# Usando Docker
docker exec -it bookstore-postgres psql -U user -d bookstore_db
```

## Variables de Entorno

La aplicación utiliza estas variables de entorno clave (configuradas en archivos docker-compose):

- `DB_HOST`: Host de la base de datos
- `DB_PORT`: Puerto de la base de datos
- `DB_USERNAME`: Nombre de usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos
- `DB_DATABASE`: Nombre de la base de datos
- `JWT_SECRET`: Secreto del token JWT
- `API_PORT`: Puerto del servidor API
- `FRONTEND_PORT`: Puerto del servidor Web

## Soporte

Si encuentras problemas:

1. Revisa los logs usando los comandos de arriba
2. Asegúrate de que todos los prerequisitos estén instalados con las versiones correctas
3. Verifica que Docker esté ejecutándose
4. Asegúrate de que los puertos 3000, 3001 y 5433 estén disponibles

## Información del Proyecto

- **Framework API**: NestJS
- **Framework Web**: Next.js
- **Base de Datos**: PostgreSQL
- **Plataforma de Contenedores**: Docker
- **Documentación API**: Swagger/OpenAPI
