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

Ejecuta API y Web por separado usando sus archivos Docker Compose individuales.

#### Paso 1: Ejecutar API (con Base de Datos)

```bash
# Navegar al directorio de API
cd book-store/book-store-api

# Iniciar API y su base de datos
docker-compose up -d

# Acceder a API en: http://localhost:3000
# Documentación de API: http://localhost:3000/apidoc
```

#### Paso 2: Ejecutar Web

```bash
# Navegar al directorio Web
cd book-store/book-store-web

# Iniciar aplicación Web
docker-compose up -d

# Acceder a Web en: http://localhost:3001
```

#### Detener Servicios

```bash
# Detener API
cd book-store/book-store-api
docker-compose down

# Detener Web
cd book-store/book-store-web
docker-compose down
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
