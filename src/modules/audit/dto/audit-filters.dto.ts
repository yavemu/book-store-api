import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AuditAction } from '../enums/audit-action.enum';

export class AuditFiltersDto {
  @ApiPropertyOptional({
    description: 'Filter by user who performed the action',
    type: String,
    example: 'user-123',
  })
  @IsOptional()
  @IsString()
  performedBy?: string;

  @ApiPropertyOptional({
    description: 'Filter by entity ID',
    type: String,
    example: 'entity-456',
  })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiPropertyOptional({
    description: 'Filter by entity type',
    type: String,
    example: 'User',
  })
  @IsOptional()
  @IsString()
  entityType?: string;

  @ApiPropertyOptional({
    description: 'Filter by action type',
    enum: AuditAction,
    example: AuditAction.CREATE,
  })
  @IsOptional()
  @IsEnum(AuditAction)
  action?: AuditAction;

  @ApiPropertyOptional({
    description: 'Filter by details content',
    type: String,
    example: 'created',
  })
  @IsOptional()
  @IsString()
  details?: string;

  @ApiPropertyOptional({
    description: 'Filter logs created after this date',
    type: String,
    format: 'date-time',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : undefined))
  createdAfter?: string;

  @ApiPropertyOptional({
    description: 'Filter logs created before this date',
    type: String,
    format: 'date-time',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : undefined))
  createdBefore?: string;
}
