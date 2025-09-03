import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, MinLength } from 'class-validator';

export class RoleFilterTermQueryDto {
  @ApiPropertyOptional({
    description: 'Término de búsqueda para filtrar roles',
    example: 'admin',
  })
  @IsString({ message: 'El término de búsqueda debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El término de búsqueda no puede estar vacío' })
  @MinLength(1, { message: 'El término debe tener al menos 1 carácter' })
  @IsOptional()
  term?: string;
}
