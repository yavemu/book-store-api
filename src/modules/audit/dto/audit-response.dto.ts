import { ApiProperty } from '@nestjs/swagger';
import { AuditAction } from '../enums/audit-action.enum';

export class AuditLogResponseDto {
  @ApiProperty({
    description: 'ID único del registro de auditoría',
    example: 'b8c4e4b2-1234-5678-9abc-def123456789',
  })
  id: string;

  @ApiProperty({
    description: 'ID del usuario que realizó la acción',
    example: 'user-uuid-123',
  })
  performedBy: string;

  @ApiProperty({
    description: 'ID de la entidad afectada por la acción',
    example: 'entity-uuid-456',
  })
  entityId: string;

  @ApiProperty({
    description: 'Tipo de acción realizada',
    enum: AuditAction,
    example: AuditAction.CREATE,
  })
  action: AuditAction;

  @ApiProperty({
    description: 'Descripción detallada de la acción realizada',
    example: 'Usuario creado exitosamente con email: john@example.com',
  })
  details: string;

  @ApiProperty({
    description: 'Tipo de entidad afectada',
    example: 'User',
  })
  entityType: string;

  @ApiProperty({
    description: 'Fecha y hora cuando se registró la auditoría',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}

export class AuditLogListResponseDto {
  @ApiProperty({
    description: 'Lista de registros de auditoría',
    type: [AuditLogResponseDto],
  })
  data: AuditLogResponseDto[];

  @ApiProperty({
    description: 'Información de paginación',
    example: {
      total: 150,
      page: 1,
      limit: 20,
      totalPages: 8,
      hasNext: true,
      hasPrev: false,
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Registros de auditoría obtenidos exitosamente',
  })
  message: string;
}

export class GetAuditLogResponseDto {
  @ApiProperty({
    description: 'Información del registro de auditoría',
    type: AuditLogResponseDto,
  })
  data: AuditLogResponseDto;

  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Registro de auditoría obtenido exitosamente',
  })
  message: string;
}

export class AuditCsvExportResponseDto {
  @ApiProperty({
    description: 'Archivo CSV con los registros de auditoría',
    example: 'ID,Action,Entity Type,Entity ID,Performed By,Timestamp,Details\n...',
  })
  data: string;

  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Registros de auditoría exportados exitosamente',
  })
  message: string;
}
