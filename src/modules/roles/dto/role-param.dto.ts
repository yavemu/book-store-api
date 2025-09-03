import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsString } from 'class-validator';

export class RoleIdParamDto {
  @ApiProperty({
    description: 'ID único del rol',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'El ID del rol debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del rol es requerido' })
  id: string;
}

export class RoleNameParamDto {
  @ApiProperty({
    description: 'Nombre único del rol',
    example: 'admin',
  })
  @IsString({ message: 'El nombre del rol debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del rol es requerido' })
  name: string;
}

export class RolePermissionParamDto {
  @ApiProperty({
    description: 'Permiso específico del rol',
    example: 'read_books',
  })
  @IsString({ message: 'El permiso debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El permiso es requerido' })
  permission: string;
}
