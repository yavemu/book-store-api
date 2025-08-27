// user.seed.ts
import { DataSource, Repository } from "typeorm";
import { User } from "../../modules/users/entities/user.entity";
import { Role } from "../../modules/roles/entities/role.entity";
import { UserRole } from "../../modules/users/enums/user-role.enum";

export class UserSeed {
  private userRepository: Repository<User>;
  private roleRepository: Repository<Role>;

  async run(dataSource: DataSource): Promise<void> {
    this.userRepository = dataSource.getRepository(User);
    this.roleRepository = dataSource.getRepository(Role);

    console.log("👤 Creando usuarios...");

    // Obtener los roles
    const adminRole = await this.roleRepository.findOne({ where: { name: UserRole.ADMIN } });
    const userRole = await this.roleRepository.findOne({ where: { name: UserRole.USER } });

    if (!adminRole || !userRole) {
      throw new Error("Roles no encontrados. Ejecuta primero el seed de roles.");
    }

    const users = [
      {
        username: "admin",
        password: "demodemo",
        email: "admin@demo.com",
        roleId: adminRole.id,
      },
      {
        username: "user",
        password: "demodemo",
        email: "user@demo.com",
        roleId: userRole.id,
      },
    ];

    for (const userData of users) {
      const existingUser = await this.userRepository.findOne({
        where: [{ username: userData.username }, { email: userData.email }],
      });

      if (!existingUser) {
        const user = this.userRepository.create(userData);
        await this.userRepository.save(user);
        console.log(`✅ Usuario ${userData.username} creado`);
      } else {
        console.log(`⚠️  Usuario ${userData.username} ya existe`);
      }
    }
  }
}
