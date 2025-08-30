import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Dirección de email del usuario',
    example: 'john@example.com',
  })
  @IsString({ message: 'El correo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El correo es requerido' })
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Password123!',
    minLength: 6,
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password: string;
}
