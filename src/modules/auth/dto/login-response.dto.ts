import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../common/enums/user-role.enum';

export class UserProfileDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 'b8c4e4b2-1234-5678-9abc-def123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({
    description: 'Dirección de email del usuario',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    example: UserRole.USER,
    enum: Object.values(UserRole),
  })
  role: string;
}

export class LoginDataDto {
  @ApiProperty({
    description: 'Token JWT para autenticación',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Información del usuario autenticado',
    type: UserProfileDto,
  })
  user: UserProfileDto;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Datos de respuesta del login',
    type: LoginDataDto,
  })
  data: LoginDataDto;

  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Login exitoso',
  })
  message: string;
}

export class RegisterDataDto {
  @ApiProperty({
    description: 'Información del usuario creado',
    type: UserProfileDto,
  })
  user: UserProfileDto;
}

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Datos de respuesta del registro',
    type: RegisterDataDto,
  })
  data: RegisterDataDto;

  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Usuario creado exitosamente',
  })
  message: string;
}

export class UserProfileDataDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 'b8c4e4b2-1234-5678-9abc-def123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({
    description: 'Dirección de email del usuario',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    example: UserRole.USER,
    enum: Object.values(UserRole),
  })
  role: string;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del usuario',
    example: '2024-01-02T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class UserProfileResponseDto {
  @ApiProperty({
    description: 'Datos del perfil del usuario',
    type: UserProfileDataDto,
  })
  data: UserProfileDataDto;

  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Perfil obtenido exitosamente',
  })
  message: string;
}
