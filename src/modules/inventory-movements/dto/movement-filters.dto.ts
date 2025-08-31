import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsUUID,
  Length,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MovementType } from '../enums/movement-type.enum';
import { MovementStatus } from '../enums/movement-status.enum';
import { UserRole } from '../../../common/enums/user-role.enum';

export class MovementFiltersDto {
  @IsOptional()
  @IsEnum(MovementType)
  @ApiPropertyOptional({
    description: 'Filtrar por tipo de movimiento específico',
    enum: MovementType,
    example: MovementType.PURCHASE,
  })
  movementType?: MovementType;

  @IsOptional()
  @IsEnum(MovementStatus)
  @ApiPropertyOptional({
    description: 'Filtrar por estado del movimiento',
    enum: MovementStatus,
    example: MovementStatus.COMPLETED,
  })
  status?: MovementStatus;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @ApiPropertyOptional({
    description: 'Filtrar por tipo de entidad (ej: book)',
    example: 'book',
    maxLength: 50,
  })
  entityType?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Filtrar por ID específico de entidad',
    example: '456e7890-e89b-12d3-a456-426614174001',
    format: 'uuid',
  })
  entityId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Filtrar por ID de usuario específico (solo ADMIN puede usar otros IDs)',
    example: '789e1234-e89b-12d3-a456-426614174002',
    format: 'uuid',
  })
  userId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @ApiPropertyOptional({
    description: 'Filtrar por rol de usuario',
    example: UserRole.ADMIN,
    maxLength: 50,
  })
  userRole?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Fecha de inicio para filtro de rango de fechas (YYYY-MM-DD)',
    example: '2024-01-01',
    format: 'date',
  })
  startDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Fecha de fin para filtro de rango de fechas (YYYY-MM-DD)',
    example: '2024-12-31',
    format: 'date',
  })
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiPropertyOptional({
    description: 'Filtrar solo movimientos activos (true) o inactivos (false)',
    example: true,
    default: true,
  })
  isActive?: boolean = true;
}
