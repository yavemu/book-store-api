import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class GetByIdParamDto {
  @ApiProperty({
    description: 'ID único del registro',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'El ID debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID es requerido' })
  id: string;
}

export class UpdateByIdParamDto {
  @ApiProperty({
    description: 'ID único del registro a actualizar',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'El ID debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID es requerido' })
  id: string;
}

export class SoftDeleteParamDto {
  @ApiProperty({
    description: 'ID único del registro a eliminar',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'El ID debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID es requerido' })
  id: string;
}

export class GetByNameParamDto {
  @ApiProperty({
    description: 'Nombre del registro',
    example: 'admin',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;
}

export class GetByPermissionParamDto {
  @ApiProperty({
    description: 'Nombre del permiso',
    example: 'READ_USERS',
  })
  @IsString({ message: 'El permiso debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El permiso es requerido' })
  permission: string;
}
