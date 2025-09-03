import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateRoleDto } from './update-role.dto';

export class UpdateRoleRequestDto {
  @ApiProperty({
    description: 'ID único del rol a actualizar',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'El ID del rol debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del rol es requerido' })
  id: string;

  @ApiProperty({
    description: 'Datos de actualización del rol',
    type: UpdateRoleDto,
  })
  @ValidateNested()
  @Type(() => UpdateRoleDto)
  updateData: UpdateRoleDto;
}
