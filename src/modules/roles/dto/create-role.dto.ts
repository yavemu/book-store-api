import { IsNotEmpty, IsString, IsOptional, IsArray, IsBoolean, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: "Nombre del rol (debe ser único)",
    example: "MANAGER",
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: "El nombre del rol debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El nombre del rol es requerido" })
  @MinLength(2, { message: "El nombre del rol debe tener al menos 2 caracteres" })
  @MaxLength(50, { message: "El nombre del rol no puede exceder 50 caracteres" })
  name: string;

  @ApiPropertyOptional({
    description: "Descripción detallada del rol y sus responsabilidades",
    example: "Manager con permisos de gestión de libros y usuarios",
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString({ message: "La descripción debe ser una cadena de texto" })
  @MaxLength(500, { message: "La descripción no puede exceder 500 caracteres" })
  description?: string;

  @ApiPropertyOptional({
    description: "Array de permisos asignados al rol",
    example: ["books:read", "books:write", "users:read"],
    type: [String],
    required: false,
  })
  @ApiPropertyOptional({
    description: "Estado del rol (activo/inactivo)",
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: "El estado activo debe ser un valor booleano" })
  isActive?: boolean;
}