import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, MinLength } from 'class-validator';

export class FilterTermQueryDto {
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
