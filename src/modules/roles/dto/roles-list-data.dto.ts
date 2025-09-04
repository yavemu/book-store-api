import { ApiProperty } from '@nestjs/swagger';
import { RoleDataDto } from './role-data.dto';

export class RolesListDataDto {
  @ApiProperty({
    description: 'List of roles',
    type: [RoleDataDto],
  })
  roles: RoleDataDto[];
}