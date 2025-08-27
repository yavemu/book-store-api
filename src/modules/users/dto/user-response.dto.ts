import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';

export class UserResponseDto {
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
    enum: UserRole,
    example: UserRole.USER
  })
  role: UserRole;

  @ApiPropertyOptional({
    description: 'ID del rol personalizado asignado al usuario',
    example: 'role-uuid-123'
  })
  roleId?: string;

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

export class UserListResponseDto {
  @ApiProperty({ 
    description: 'Lista de usuarios', 
    type: [UserResponseDto] 
  })
  data: UserResponseDto[];

  @ApiProperty({
    description: 'Información de paginación',
    example: {
      total: 25,
      page: 1,
      limit: 10,
      totalPages: 3,
      hasNext: true,
      hasPrev: false
    }
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class CreateUserResponseDto {
  @ApiProperty({ 
    description: 'Mensaje de confirmación', 
    example: 'Usuario creado exitosamente' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Información del usuario creado',
    type: UserResponseDto
  })
  user: UserResponseDto;
}

export class UpdateUserResponseDto {
  @ApiProperty({ 
    description: 'Mensaje de confirmación', 
    example: 'Usuario actualizado exitosamente' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Información del usuario actualizado',
    type: UserResponseDto
  })
  user: UserResponseDto;
}

export class DeleteUserResponseDto {
  @ApiProperty({ 
    description: 'Mensaje de confirmación', 
    example: 'Usuario eliminado exitosamente' 
  })
  message: string;

  @ApiProperty({ 
    description: 'ID del usuario eliminado', 
    example: 'b8c4e4b2-1234-5678-9abc-def123456789' 
  })
  deletedUserId: string;
}