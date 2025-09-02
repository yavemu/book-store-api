import { IsString, IsOptional, IsEmail, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserExactSearchDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Nombre de usuario',
    example: 'admin',
  })
  username?: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Correo electrónico del usuario',
    example: 'admin@bookstore.com',
  })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  lastName?: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'ID del rol del usuario',
    example: 'uuid-del-rol',
  })
  roleId?: string;
}
