// run_seed.ts
import { DataSource } from "typeorm";
import { databaseConfig } from "../../config/database.config";
import { RoleSeed } from "./role.seed";
import { UserSeed } from "./user.seed";

async function runSeeds() {
  const dataSource = new DataSource(databaseConfig as any);

  try {
    await dataSource.initialize();
    console.log("📊 Conexión a la base de datos establecida");

    // Ejecutar seed de roles primero
    const roleSeed = new RoleSeed();
    console.log("⏳ Ejecutando seeds de roles...");
    await roleSeed.run(dataSource);

    // Ejecutar seed de usuarios después
    const userSeed = new UserSeed();
    console.log("⏳ Ejecutando seeds de usuarios...");
    await userSeed.run(dataSource);

    console.log("✅ Todos los seeds ejecutados correctamente");
  } catch (error) {
    console.error("❌ Error ejecutando seeds:", error);
  } finally {
    await dataSource.destroy();
  }
}

runSeeds();
