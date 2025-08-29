import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, IsUUID } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterUserDto {
  @ApiProperty({
    description: "Nombre de usuario único para el sistema",
    example: "john_doe",
    minLength: 3,
    maxLength: 50,
  })
  @IsString({ message: "El nombre de usuario debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El nombre de usuario es requerido" })
  @MinLength(3, { message: "El nombre de usuario debe tener al menos 3 caracteres" })
  @MaxLength(50, { message: "El nombre de usuario no puede exceder 50 caracteres" })
  username: string;

  @ApiProperty({
    description: "Contraseña del usuario (mínimo 6 caracteres)",
    example: "Password123!",
    minLength: 6,
  })
  @IsString({ message: "La contraseña debe ser una cadena de texto" })
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  password: string;

  @ApiProperty({
    description: "Dirección de email válida del usuario",
    example: "john@example.com",
    format: "email",
  })
  @IsEmail({}, { message: "Debe proporcionar un email válido" })
  email: string;

  @ApiPropertyOptional({
    description: "ID del rol del usuario en el sistema (UUID). Si no se especifica, se asigna rol USER por defecto",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: "El roleId debe ser un UUID válido" })
  roleId?: string;
}
