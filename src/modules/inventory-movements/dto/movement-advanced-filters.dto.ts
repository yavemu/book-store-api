import {
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsDateString,
  IsString,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MovementType } from '../enums/movement-type.enum';

export class MovementAdvancedFiltersDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Precio mínimo antes del cambio',
    example: 10000,
    minimum: 0,
    type: 'number',
    format: 'decimal',
  })
  minPriceBefore?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Precio máximo antes del cambio',
    example: 100000,
    minimum: 0,
    type: 'number',
    format: 'decimal',
  })
  maxPriceBefore?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Precio mínimo después del cambio',
    example: 15000,
    minimum: 0,
    type: 'number',
    format: 'decimal',
  })
  minPriceAfter?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Precio máximo después del cambio',
    example: 150000,
    minimum: 0,
    type: 'number',
    format: 'decimal',
  })
  maxPriceAfter?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99999)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Cantidad mínima antes del cambio',
    example: 0,
    minimum: 0,
    maximum: 99999,
  })
  minQuantityBefore?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99999)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Cantidad máxima antes del cambio',
    example: 1000,
    minimum: 0,
    maximum: 99999,
  })
  maxQuantityBefore?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99999)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Cantidad mínima después del cambio',
    example: 0,
    minimum: 0,
    maximum: 99999,
  })
  minQuantityAfter?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99999)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Cantidad máxima después del cambio',
    example: 500,
    minimum: 0,
    maximum: 99999,
  })
  maxQuantityAfter?: number;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Fecha de creación después de (YYYY-MM-DD)',
    example: '2024-01-01',
    format: 'date',
  })
  createdAfter?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Fecha de creación antes de (YYYY-MM-DD)',
    example: '2024-12-31',
    format: 'date',
  })
  createdBefore?: string;

  @IsOptional()
  @IsEnum(MovementType)
  @ApiPropertyOptional({
    description: 'Filtrar por tipo de movimiento específico',
    enum: MovementType,
    example: MovementType.PURCHASE,
  })
  movementType?: MovementType;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Filtrar por tipo de entidad (ej: book)',
    example: 'book',
  })
  entityType?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Filtrar por notas o descripción',
    example: 'Actualización completada exitosamente',
  })
  notes?: string;
}
