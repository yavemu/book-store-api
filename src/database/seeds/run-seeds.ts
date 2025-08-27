import { DataSource } from 'typeorm';
import { databaseConfig } from '../../config/database.config';
import { UserSeed } from './user.seed';

async function runSeeds() {
  const dataSource = new DataSource(databaseConfig as any);

  try {
    await dataSource.initialize();
    console.log('📊 Database connection established');

    const userSeed = new UserSeed();
    await userSeed.run(dataSource);

    console.log('✅ All seeds completed successfully');
  } catch (error) {
    console.error('❌ Error running seeds:', error);
  } finally {
    await dataSource.destroy();
  }
}

runSeeds();