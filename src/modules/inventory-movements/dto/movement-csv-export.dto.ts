import { IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MovementFiltersDto } from './movement-filters.dto';
import { MovementSearchDto } from './movement-search.dto';
import { MovementAdvancedFiltersDto } from './movement-advanced-filters.dto';

export class MovementCsvExportDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MovementFiltersDto)
  @ApiProperty({
    description:
      'Filtros básicos para la exportación (OBLIGATORIO - debe contener al menos un filtro)',
    type: MovementFiltersDto,
  })
  filters: MovementFiltersDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MovementSearchDto)
  @ApiPropertyOptional({
    description: 'Parámetros de búsqueda por texto',
    type: MovementSearchDto,
  })
  search?: MovementSearchDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MovementAdvancedFiltersDto)
  @ApiPropertyOptional({
    description: 'Filtros avanzados por rangos numéricos',
    type: MovementAdvancedFiltersDto,
  })
  advancedFilters?: MovementAdvancedFiltersDto;
}
