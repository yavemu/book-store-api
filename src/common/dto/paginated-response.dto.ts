import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MetaDto {
  @ApiProperty({
    description: 'Número total de registros',
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: 'Página actual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Número de elementos por página',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total de páginas disponibles',
    example: 15,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Indica si hay una página siguiente',
    example: true,
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Indica si hay una página anterior',
    example: false,
  })
  hasPrev: boolean;
}

export abstract class BasePaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Array de datos paginados',
    isArray: true,
  })
  data: T[];

  @ApiProperty({
    description: 'Información de paginación',
    type: MetaDto,
  })
  meta: MetaDto;

  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Datos obtenidos exitosamente',
  })
  message: string;
}

export class StandardResponseDto<T> {
  @ApiProperty({
    description: 'Datos de respuesta',
  })
  data: T;

  @ApiProperty({
    description: 'Metadatos adicionales (opcional)',
    required: false,
  })
  meta?: any;

  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Operación exitosa',
  })
  message: string;
}
