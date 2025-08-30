import { IsOptional, IsNumber, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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
}
