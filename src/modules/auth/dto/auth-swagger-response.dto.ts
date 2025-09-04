import { ApiProperty } from '@nestjs/swagger';
import { LoginDataDto, RegisterDataDto, UserProfileDataDto } from './login-response.dto';

// Swagger-specific response DTOs that extend StandardResponseDto structure

export class LoginSwaggerResponseDto {
  @ApiProperty({
    description: 'Datos de respuesta del login',
    type: LoginDataDto,
  })
  data: LoginDataDto;

  @ApiProperty({
    description: 'Metadatos adicionales (opcional)',
    required: false,
  })
  meta?: any;

  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Login exitoso',
  })
  message: string;
}

export class RegisterSwaggerResponseDto {
  @ApiProperty({
    description: 'Datos de respuesta del registro',
    type: RegisterDataDto,
  })
  data: RegisterDataDto;

  @ApiProperty({
    description: 'Metadatos adicionales (opcional)',
    required: false,
  })
  meta?: any;

  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Usuario creado exitosamente',
  })
  message: string;
}

export class UserProfileSwaggerResponseDto {
  @ApiProperty({
    description: 'Datos del perfil del usuario',
    type: UserProfileDataDto,
  })
  data: UserProfileDataDto;

  @ApiProperty({
    description: 'Metadatos adicionales (opcional)',
    required: false,
  })
  meta?: any;

  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Perfil obtenido exitosamente',
  })
  message: string;
}