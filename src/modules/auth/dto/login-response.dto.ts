import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ 
    description: 'ID único del usuario', 
    example: 'b8c4e4b2-1234-5678-9abc-def123456789' 
  })
  id: string;

  @ApiProperty({ 
    description: 'Nombre de usuario único', 
    example: 'john_doe' 
  })
  username: string;

  @ApiProperty({ 
    description: 'Dirección de email del usuario', 
    example: 'john@example.com' 
  })
  email: string;

  @ApiProperty({ 
    description: 'Rol del usuario en el sistema', 
    example: 'USER',
    enum: ['ADMIN', 'USER']
  })
  role: string;
}

export class LoginResponseDto {
  @ApiProperty({ 
    description: 'Token JWT para autenticación', 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' 
  })
  access_token: string;

  @ApiProperty({ 
    description: 'Información del usuario autenticado',
    type: UserProfileDto
  })
  user: UserProfileDto;
}

export class RegisterResponseDto {
  @ApiProperty({ 
    description: 'Mensaje de confirmación', 
    example: 'Usuario creado exitosamente' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Información del usuario creado',
    type: UserProfileDto
  })
  user: UserProfileDto;
}

export class UserProfileResponseDto {
  @ApiProperty({ 
    description: 'ID único del usuario', 
    example: 'b8c4e4b2-1234-5678-9abc-def123456789' 
  })
  id: string;

  @ApiProperty({ 
    description: 'Nombre de usuario único', 
    example: 'john_doe' 
  })
  username: string;

  @ApiProperty({ 
    description: 'Dirección de email del usuario', 
    example: 'john@example.com' 
  })
  email: string;

  @ApiProperty({ 
    description: 'Rol del usuario en el sistema', 
    example: 'USER',
    enum: ['ADMIN', 'USER']
  })
  role: string;

  @ApiProperty({ 
    description: 'Fecha de creación del usuario', 
    example: '2024-01-01T00:00:00.000Z' 
  })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Fecha de última actualización del usuario', 
    example: '2024-01-02T00:00:00.000Z' 
  })
  updatedAt: Date;
}