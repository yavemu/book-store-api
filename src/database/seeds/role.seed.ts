import { Role } from '../../modules/roles/entities/role.entity';
import { DataSource, Repository } from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';

export class RoleSeed {
  private roleRepository: Repository<Role>;

  async run(dataSource: DataSource): Promise<void> {
    this.roleRepository = dataSource.getRepository(Role);

    console.log('🌱 Creando roles...');

    const roles = [
      {
        name: UserRole.ADMIN,
        description: 'Administrator role with full access',
        isActive: true,
      },
      {
        name: UserRole.USER,
        description: 'Standard user role with basic access',
        isActive: true,
      },
    ];

    let roleCount = 0;
    for (const roleData of roles) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleData.name },
      });

      if (!existingRole) {
        const role = this.roleRepository.create(roleData);
        await this.roleRepository.save(role);
        console.log(`   ✅ Rol ${roleData.name} creado`);
        roleCount++;
      } else {
        console.log(`   ⚠️  Rol ${roleData.name} ya existe`);
      }
    }

    console.log(`💾 ${roleCount} roles nuevos creados`);
    console.log('✅ Roles procesados correctamente');
  }
}
