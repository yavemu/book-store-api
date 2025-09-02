import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BookExactSearchDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Título del libro',
    example: 'Cien años de soledad',
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Código ISBN del libro',
    example: '9788439732471',
  })
  isbnCode?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Precio del libro',
    example: 25.99,
  })
  price?: number;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @ApiPropertyOptional({
    description: 'Disponibilidad del libro',
    example: true,
  })
  isAvailable?: boolean;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Cantidad en stock',
    example: 100,
  })
  stockQuantity?: number;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Fecha de publicación',
    example: '2023-01-15',
  })
  publicationDate?: Date;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Número de páginas',
    example: 350,
  })
  pageCount?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Resumen del libro',
    example: 'Una obra maestra de la literatura latinoamericana...',
  })
  summary?: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'ID del género',
    example: 'uuid-del-genero',
  })
  genreId?: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'ID de la editorial',
    example: 'uuid-de-la-editorial',
  })
  publisherId?: string;
}
