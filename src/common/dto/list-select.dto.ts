import { ApiProperty } from '@nestjs/swagger';

export class ListSelectDto {
  @ApiProperty({
    description: 'Identificador único del registro',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre o etiqueta para mostrar en la selección',
    example: 'Ciencia Ficción',
  })
  name: string;
}
