#!/bin/bash
set -e

echo "🗄️  ===================================="
echo "🗄️  INICIALIZANDO BASE DE DATOS"
echo "🗄️  ===================================="
echo

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Crear usuario de la aplicación
    CREATE USER "$DB_USERNAME" WITH PASSWORD '$DB_PASSWORD';
    
    -- Crear base de datos de la aplicación
    CREATE DATABASE "$DB_DATABASE";
    
    -- Otorgar privilegios
    GRANT ALL PRIVILEGES ON DATABASE "$DB_DATABASE" TO "$DB_USERNAME";
    
    -- Conectar a la base de datos de la aplicación
    \c "$DB_DATABASE";
    
    -- Otorgar permisos en el schema público
    GRANT ALL ON SCHEMA public TO "$DB_USERNAME";
    GRANT CREATE ON SCHEMA public TO "$DB_USERNAME";
EOSQL

echo
echo "✅ Base de datos '$DB_DATABASE' creada exitosamente"
echo "✅ Usuario '$DB_USERNAME' configurado con permisos"
echo "🗄️  ==================================="
echo "🗄️  INICIALIZACIÓN COMPLETADA"
echo "🗄️  ==================================="