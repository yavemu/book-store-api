import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BookGenreResponseDto {
  @ApiProperty({
    description: 'ID único del género',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del género',
    example: 'Ciencia Ficción',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción del género',
    example: 'Narrativa de hechos imaginarios vinculados con el desarrollo científico.',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Estado activo del género',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación del género',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del género',
    example: '2024-01-02T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class BookGenreListResponseDto {
  @ApiProperty({
    description: 'Lista de géneros',
    type: [BookGenreResponseDto],
  })
  data: BookGenreResponseDto[];

  @ApiProperty({
    description: 'Información de paginación',
    example: {
      total: 15,
      page: 1,
      limit: 10,
      totalPages: 2,
      hasNext: true,
      hasPrev: false,
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Géneros obtenidos exitosamente',
  })
  message: string;
}

export class CreateBookGenreResponseDto {
  @ApiProperty({
    description: 'Información del género creado',
    type: BookGenreResponseDto,
  })
  data: BookGenreResponseDto;

  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Género de libro creado exitosamente',
  })
  message: string;
}

export class UpdateBookGenreResponseDto {
  @ApiProperty({
    description: 'Información del género actualizado',
    type: BookGenreResponseDto,
  })
  data: BookGenreResponseDto;

  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Género de libro actualizado exitosamente',
  })
  message: string;
}

export class DeleteBookGenreResponseDto {
  @ApiProperty({
    description: 'ID del género eliminado',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  data: string;

  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Género de libro eliminado exitosamente',
  })
  message: string;
}
