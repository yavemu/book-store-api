import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ 
    description: 'Nombre de usuario único para el sistema', 
    example: 'john_doe',
    minLength: 3,
    maxLength: 50
  })
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
  @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre de usuario no puede exceder 50 caracteres' })
  username: string;

  @ApiProperty({ 
    description: 'Contraseña del usuario (mínimo 6 caracteres)', 
    example: 'Password123!',
    minLength: 6
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({ 
    description: 'Dirección de email válida del usuario', 
    example: 'john@example.com',
    format: 'email'
  })
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  email: string;

  @ApiPropertyOptional({ 
    description: 'Rol del usuario en el sistema', 
    enum: UserRole,
    example: UserRole.USER,
    default: UserRole.USER
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol debe ser uno de los valores permitidos: ADMIN, USER' })
  role?: UserRole;
}