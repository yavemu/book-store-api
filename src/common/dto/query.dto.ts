import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, MinLength } from 'class-validator';

export class TermQueryDto {
  @ApiPropertyOptional({
    description: 'Término de búsqueda para filtrar registros',
    example: 'término de búsqueda',
  })
  @IsString({ message: 'El término debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El término no puede estar vacío' })
  @MinLength(1, { message: 'El término debe tener al menos 1 carácter' })
  @IsOptional()
  term?: string;
}

export class SearchQueryDto {
  @ApiPropertyOptional({
    description: 'Término de búsqueda general',
    example: 'buscar',
  })
  @IsString({ message: 'La búsqueda debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El término de búsqueda no puede estar vacío' })
  @IsOptional()
  search?: string;
}

export class GenreIdQueryDto {
  @ApiPropertyOptional({
    description: 'ID del género para filtrar',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString({ message: 'El ID del género debe ser una cadena de texto' })
  @IsOptional()
  genreId?: string;
}

export class PublisherIdQueryDto {
  @ApiPropertyOptional({
    description: 'ID de la editorial para filtrar',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsString({ message: 'El ID de la editorial debe ser una cadena de texto' })
  @IsOptional()
  publisherId?: string;
}
