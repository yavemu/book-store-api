import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRoleDto } from './create-role.dto';

export class CreateRoleRequestDto {
  @ApiProperty({
    description: 'Datos de creación del rol',
    type: CreateRoleDto,
  })
  @ValidateNested()
  @Type(() => CreateRoleDto)
  roleData: CreateRoleDto;
}
