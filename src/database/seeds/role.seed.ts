import { Role } from "../../modules/roles/entities/role.entity";
import { DataSource, Repository } from "typeorm";
import { UserRole } from "../../modules/users/enums";

export class RoleSeed {
  private roleRepository: Repository<Role>;

  async run(dataSource: DataSource): Promise<void> {
    this.roleRepository = dataSource.getRepository(Role);

    console.log("🌱 Creando roles...");

    const roles = [
      {
        name: UserRole.ADMIN,
        description: "Administrator role with full access",
        permissions: ["create", "read", "update", "delete", "manage_users"],
        isActive: true,
      },
      {
        name: "USER",
        description: "Standard user role with basic access",
        permissions: ["read", "update_own"],
        isActive: true,
      },
    ];

    for (const roleData of roles) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleData.name },
      });

      if (!existingRole) {
        const role = this.roleRepository.create(roleData);
        await this.roleRepository.save(role);
        console.log(`✅ Rol ${roleData.name} creado`);
      } else {
        console.log(`⚠️  Rol ${roleData.name} ya existe`);
      }
    }
  }
}
