// run_seed.ts
import { DataSource } from 'typeorm';
import { databaseConfig } from '../../config/database.config';
import { RoleSeed } from './role.seed';
import { UserSeed } from './user.seed';
import { PopulateSeed } from './populate.seed';

async function runSeeds() {
  console.log('🌱 =================================');
  console.log('🌱 INICIANDO PROCESO DE SEEDS');
  console.log('🌱 =================================');

  const dataSource = new DataSource(databaseConfig as any);

  try {
    console.log('🔗 Conectando a la base de datos...');
    await dataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida');
    console.log('');

    // Ejecutar seed de roles primero
    console.log('🔄 PASO 1/3: ROLES');
    console.log('----------------------------------------');
    const roleSeed = new RoleSeed();
    await roleSeed.run(dataSource);
    console.log('');

    // Ejecutar seed de usuarios después
    console.log('🔄 PASO 2/3: USUARIOS');
    console.log('----------------------------------------');
    const userSeed = new UserSeed();
    await userSeed.run(dataSource);
    console.log('');

    // Ejecutar seed de población masiva de datos
    console.log('🔄 PASO 3/3: POBLACIÓN MASIVA');
    console.log('----------------------------------------');
    const populateSeed = new PopulateSeed();
    await populateSeed.run(dataSource);
    console.log('');

    console.log('🎉 =================================');
    console.log('🎉 TODOS LOS SEEDS EJECUTADOS CORRECTAMENTE');
    console.log('🎉 Base de datos inicializada con éxito');
    console.log('🎉 =================================');
  } catch (error) {
    console.log('');
    console.log('❌ =================================');
    console.log('❌ ERROR EN PROCESO DE SEEDS');
    console.log('❌ =================================');
    console.error('❌ Detalle del error:', error);
    console.log('❌ =================================');
    process.exit(1);
  } finally {
    console.log('🔌 Cerrando conexión a la base de datos...');
    await dataSource.destroy();
    console.log('✅ Conexión cerrada correctamente');
  }
}

runSeeds();
