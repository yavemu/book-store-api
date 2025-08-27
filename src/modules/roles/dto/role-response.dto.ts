import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty({ 
    description: 'ID único del rol', 
    example: 'b8c4e4b2-1234-5678-9abc-def123456789' 
  })
  id: string;

  @ApiProperty({ 
    description: 'Nombre del rol', 
    example: 'MANAGER' 
  })
  name: string;

  @ApiPropertyOptional({ 
    description: 'Descripción del rol', 
    example: 'Manager con permisos de gestión de libros y usuarios' 
  })
  description?: string;

  @ApiProperty({ 
    description: 'Estado del rol (activo/inactivo)', 
    example: true 
  })
  isActive: boolean;

  @ApiProperty({ 
    description: 'Fecha de creación del rol', 
    example: '2024-01-01T00:00:00.000Z' 
  })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Fecha de última actualización del rol', 
    example: '2024-01-02T00:00:00.000Z' 
  })
  updatedAt: Date;
}

export class RoleListResponseDto {
  @ApiProperty({ 
    description: 'Lista de roles', 
    type: [RoleResponseDto] 
  })
  data: RoleResponseDto[];

  @ApiProperty({
    description: 'Información de paginación',
    example: {
      total: 10,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNext: false,
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