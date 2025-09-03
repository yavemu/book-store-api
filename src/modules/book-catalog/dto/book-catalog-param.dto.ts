import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class BookCatalogIdParamDto {
  @ApiProperty({
    description: 'ID único del libro en el catálogo',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'El ID del libro debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del libro es requerido' })
  id: string;
}
